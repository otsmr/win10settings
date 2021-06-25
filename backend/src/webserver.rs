#![deny(warnings)]

use bytes::Buf;
use std::env;
use hex;
use regex::Regex;
use tokio::fs::File;
use std::path::PathBuf;
use tokio_util::codec::{BytesCodec, FramedRead};
use hyper::service::{make_service_fn, service_fn};
use hyper::{header, Body, Method, Request, Response, Server, StatusCode};
use sha2::Sha256;
use hmac::{Hmac, Mac, NewMac};
use base64;

type GenericError = Box<dyn std::error::Error + Send + Sync>;
type Result<T> = std::result::Result<T, GenericError>;


async fn static_files(unsafe_path: &str) -> Result<Response<Body>> {

    let re = Regex::new(r"[^-a-z0-9./]").unwrap();
    let unsafe_path = re.replace_all(unsafe_path, "x");

    // Protection against file inclusion vulnerability :^)
    if unsafe_path.find("..") != None {
        return Ok(not_found())
    }
    if unsafe_path.find("//") != None {
        return Ok(not_found())
    }

    // FIXME: DOCUMENT_PATH in production mode 
    let filepath = PathBuf::from(String::from(env::current_exe().unwrap().to_str().unwrap()) + "\\..\\..\\..\\..\\frontend\\build\\" + &unsafe_path.to_ascii_lowercase());

    if let Ok(file) = File::open(filepath).await {
        let stream = FramedRead::new(file, BytesCodec::new());
        let body = Body::wrap_stream(stream);
        return Ok(Response::new(body));
    }

    Ok(not_found())
}

async fn api_post_response(req: Request<Body>, nonce: String) -> Result<Response<Body>> {

    type HmacSha256 = Hmac<Sha256>;

    println!("nonce={}", nonce);

    let whole_body = hyper::body::aggregate(req).await?;
    
    // Decode as JSON...
    let raw_data: serde_json::Value = serde_json::from_reader(whole_body.reader())?;
    let data = &raw_data["data"];

    // --- Validate HMAC ---

    let mut mac = HmacSha256::new_from_slice(nonce.as_bytes()).expect("HMAC can take key of any size");
    let verify_data: String = raw_data["data"].to_string();

    let verify_data = base64::encode(verify_data);

    mac.update(verify_data.as_bytes());

    let hmac = mac.finalize().into_bytes();
    let hex_string = hex::encode(&hmac);
    
    if raw_data["hmac"] != hex_string {
        println!("Signatur ungültig!");
        // panic!("Signatur ungültig!");
        return Ok(not_found())
    }

    // --- HMAC is valid ---

    // FIXME: counter -> prevent reply attacks

    println!("{}", data);

    let json = serde_json::to_string(&data)?;
    let response = Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/json")
        .header(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*")
        .header(header::ACCESS_CONTROL_ALLOW_HEADERS, "*")
        .body(Body::from(json))?;

    Ok(response)

}

async fn handle_request(
    req: Request<Body>,
    nonce: String
    // client: Client<HttpConnector>,
) -> Result<Response<Body>> {

    let req_path = req.uri().path();

    if req.method() == &Method::POST {

        println!("req_path={}", req_path);

        match req_path {
            "/api" => api_post_response(req, nonce).await,
            _ => Ok(not_found()),
        }

    } else if req.method() == &Method::GET {

        static_files(req_path).await
        
    } else {
        Ok(not_found())
    }

}

fn not_found() -> Response<Body> {
    Response::builder()
        .status(StatusCode::OK)
        .header(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*") // FIXME: only allow localhost:frontendport
        .header(header::ACCESS_CONTROL_ALLOW_HEADERS, "*")
        .body("Not Found".into())
        .unwrap()
}

#[tokio::main]
pub async fn start_webserver(nonce: String) -> Result<()> {

    let addr = "127.0.0.1:13253".parse().unwrap();

    // Share a `Client` with all `Service`s
    // let client = Client::new();

    println!("NOINCE");

    let shared_nonce = nonce.clone();

    let new_service = make_service_fn(move |_| {
        // Move a clone of `client` into the `service_fn`.
        let shared_nonce = shared_nonce.clone();
        async {
            Ok::<_, GenericError>(service_fn(move |req| {
                // Clone again to ensure that client outlives this closure.
                handle_request(req, shared_nonce.to_owned())
                // response_examples(req, client.to_owned())
            }))
        }
    });

    let server = Server::bind(&addr).serve(new_service);

    println!("Listening on http://{}", addr);

    server.await?;

    Ok(())
}
