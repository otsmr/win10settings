
use serde_json::json;
use crate::config::{ ConfigWrapper };
use crate::utils;

pub fn router(data: &serde_json::Value) -> Result<serde_json::Value, String> {

    let id = data["id"].as_str().unwrap();


    if data["method"] == "open" {

        match id {
            "href" => {
                let href = data["body"]["url"].as_str().unwrap();
                utils::open_webpage(href).unwrap();
            },
            _ => {}
        }

        return Ok(json!({}))

    }

    let mut id = id.split(":");

    let mut result = json!({});
    
    let mut error = false; 

    match id.next().unwrap() {

        "app" => {

            match id.next().unwrap() {

                "env" => {

                    match id.next().unwrap() {
                        "isadmin" => {
                            let isadmin = utils::is_running_as_admin().unwrap();
                            result = json!(isadmin);
                        },
                        "version" => {
                            result = json!(env!("CARGO_PKG_VERSION"));
                        },
                        _ => { error = true; }
                    }

                },

                "config" => {

                    let current_id = id.next().unwrap();
                    match current_id {

                        "language" | "theme" => {
                            if data["method"] == "set" {
                                ConfigWrapper::set_config_string(current_id, data["body"]["value"].as_str().unwrap());
                            }
                            result = ConfigWrapper::get_config_string(current_id);
                        },
                        "auto_update_check" | "winapps_filter_systemapps" => {
                            if data["method"] == "set" {
                                ConfigWrapper::set_config_bool(current_id, data["body"]["checked"].as_bool().unwrap());
                            }
                            result = ConfigWrapper::get_config_bool(current_id);
                        },
                        _ => { error = true; }

                    }

                },
                _ => { error = true; }
            }

        },
        _ => { error = true; }

    }

    if error {
        println!("NOT FOUND: {:?}", data);
    }

    Ok(json!({
        "error": error,
        "data": result
    }))

}