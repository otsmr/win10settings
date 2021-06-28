mod webserver;
mod webview;
mod settings;
mod utils;
mod config;

use std::{time};

use std::env;
use std::thread;
use rand::{thread_rng, Rng};
use rand::distributions::Alphanumeric;

fn main() {

    let mut agrs = env::args();

    agrs.next();

    if agrs.next() == Some(String::from("c")) {

        println!("is_admin={}", utils::is_running_as_admin().unwrap());

        let data = agrs.next().unwrap();
        let data = data.replace("'", "\"");
        
        let data: serde_json::Value = serde_json::from_str(&data).unwrap();
        let result = settings::router(&data).unwrap();

        print!("{}", result.to_string());

        thread::sleep(time::Duration::from_millis(10000000));

        return

    }

    println!("agrs[1] {:?}", agrs.next());
    println!("agrs[2] {:?}", agrs.next());

    // for argument in agrs {
    //     println!("{}", argument);
    // }

    let nonce: String = thread_rng()
        .sample_iter(&Alphanumeric)
        .take(40)
        .map(char::from)
        .collect();

    let shared_nonce = nonce.clone();
    thread::spawn(move || {
        webserver::start_webserver(shared_nonce).unwrap();
    });

    let shared_nonce = nonce.clone();
    let child_webview = thread::spawn(move || {
        webview::start_webview(shared_nonce);
    });

    // Program is automatically closed with the WebView
    child_webview.join().unwrap();

}