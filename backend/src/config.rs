use std::path::PathBuf;
use std::fs;
use std::fs::File;
use std::io::prelude::*;
extern crate dirs;
use serde_json::json;
use std::fs::OpenOptions;

fn get_config_path () -> PathBuf {

    let mut path = PathBuf::from(dirs::config_dir().unwrap());
    path.push("win10settings");
    fs::create_dir_all(path.clone()).unwrap();
    path.push(".config.json");

    path

}

fn init_config () {

    let path = get_config_path();

    if !path.exists() {

        let default_config = json!({
            "theme": "system"
        });
        let default_config = default_config.to_string();

        let mut file = File::create(path.clone()).unwrap();
        file.write_all(default_config.as_bytes()).unwrap();

    }

}

pub fn get_config () -> serde_json::Value {

    init_config();
    let path = get_config_path();

    let contents = fs::read_to_string(path).unwrap();

    serde_json::from_str(contents.as_str()).unwrap()

}

pub fn update_config (new_config: serde_json::Value) -> Result<(), ()> {

    init_config();
    let path = get_config_path();

    let mut buffer = OpenOptions::new()
        .read(true)
        .write(true)
        .truncate(true)
        .open(path)
        .unwrap();

    let json = new_config.to_string();

    buffer.write_all(json.as_bytes()).unwrap();

    Ok(())

}