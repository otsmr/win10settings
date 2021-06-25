use webview_official::{SizeHint, WebviewBuilder};

pub fn start_webview(nonce: String) {

    let mut webview = WebviewBuilder::new()
        .debug(true)
        .title("win10settings")
        .width(1800)
        .height(1400)
        .resize(SizeHint::NONE)
        .url(&(String::from("http://127.0.0.1:3002/index.html#nonce=") + &nonce))
        .build();
    
    webview.run();

}