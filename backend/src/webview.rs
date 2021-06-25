use webview_official::{SizeHint, WebviewBuilder};

pub fn start_webview(nonce: String) {

    let mut webview = WebviewBuilder::new()
        .debug(true)
        .title("Erweitere Windows-Einstellungen")
        .width(1600)
        .height(1000)
        .resize(SizeHint::NONE)
        .url(&(String::from("http://127.0.0.1:3002/index.html#nonce=") + &nonce))
        .build();
    
    webview.run();

}