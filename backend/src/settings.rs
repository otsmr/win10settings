
use serde_json::json;
use crate::config::{ ConfigWrapper };
use crate::utils;
use runas::Command;


pub enum ExecutionErrors {
    None,
    Unknown,
    NotDefined,
    PermissionDenied
}

impl PartialEq for ExecutionErrors {
    fn eq(&self, other: &Self) -> bool {
        self == other
    }
}

mod privacy;

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
    
    let mut error = ExecutionErrors::None; 

    match id.next().unwrap() {

        "privacy" => {

            match id.next().unwrap() {
                "telemetrie" => {


                    match id.next().unwrap() {
                        "allowtelemetry" => {

                            if data["method"] == "set" {
                                let enable =  data["body"]["checked"].as_bool().unwrap();

                                match privacy::telemetrie::set_allow_telemetry(enable) {
                                    Ok(_) => {},
                                    Err(e) => {
                                        error = e;
                                    } 
                                }

                            }

                            match privacy::telemetrie::get_allow_telemetry() {
                                Ok(enabled) => {
                                    result = json!(enabled);
                                },
                                Err(_e) => { error = ExecutionErrors::NotDefined; }
                            }

                        },
                        _ => { error = ExecutionErrors::NotDefined; }
                    }

                    
                },
                _ => { error = ExecutionErrors::NotDefined; }
            }

        },

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
                        _ => { error = ExecutionErrors::NotDefined; }
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
                        _ => { error = ExecutionErrors::NotDefined; }

                    }

                },
                _ => { error = ExecutionErrors::NotDefined; }
            }

        },
        _ => { error = ExecutionErrors::NotDefined; }

    }

    let mut result_error = true;

    match error {
        ExecutionErrors::None => {
            result_error = false;
        },
        ExecutionErrors::NotDefined => {
            result_error = true;
            println!("NOT FOUND: {:?}", data);
        }
        ExecutionErrors::PermissionDenied => {
            result_error = true;
            println!("PermissionDenied {:?}", data);

            if utils::is_running_as_admin().unwrap() == false {

                let status = Command::new(std::env::current_exe().unwrap())
                    .arg("c")
                    .arg(data.to_string())
                    .status()
                    .expect("failed to execute");

                println!("[status]={}", status);

            }

            

        },
        _ => {
            // result_error = true;
        }
    }

    Ok(json!({
        "error": result_error,
        "data": result
    }))

}