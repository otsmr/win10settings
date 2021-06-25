mod webserver;
mod webview;
use std::thread;
use rand::{thread_rng, Rng};
use rand::distributions::Alphanumeric;

fn main() {

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