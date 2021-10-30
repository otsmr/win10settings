
use serde_json::json;
use crate::config::{ ConfigWrapper };
use crate::utils;
use runas::Command;
use std::io;


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
mod explorer;

pub fn router(data: &serde_json::Value, viacommandline: bool) -> Result<serde_json::Value, String> {

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

            let mut enable = false;
            if data["method"] == "set" {
                enable =  data["body"]["checked"].as_bool().unwrap();
            }

            match id.next().unwrap() {
                "telemetrie" => {

                    let mut get: io::Result<bool> = Ok(false);

                    match id.next().unwrap() {

                        "requestFeedback" => {

                            if data["method"] == "set" {
                                match privacy::telemetrie::disable_request_feedback() {
                                    Ok(_) => {},
                                    Err(e) => { error = e; } 
                                }
                            }

                            get = privacy::telemetrie::get_request_feedback();
                            
                        }
                        "basicPrivacySettings" => {

                            // if data["method"] == "set" {
                            //     match privacy::telemetrie::disable_request_feedback() {
                            //         Ok(_) => {},
                            //         Err(e) => { error = e; } 
                            //     }
                            // }

                            get = privacy::telemetrie::get_basic_privacy_settings();

                        }
                        "lockDomainsWithHosts" => {

                        }

                        "allowtelemetry" => {

                            if data["method"] == "set" {
                                match privacy::telemetrie::set_allow_telemetry(enable) {
                                    Ok(_) => {},
                                    Err(e) => { error = e; } 
                                }
                            }
                            get = privacy::telemetrie::get_allow_telemetry();

                        },
                        _ => { error = ExecutionErrors::NotDefined; }
                    }

                    match get {
                        Ok(enabled) => { result = json!(enabled); },
                        Err(_) => { error = ExecutionErrors::NotDefined; }
                    }

                },
                _ => { error = ExecutionErrors::NotDefined; }
            }

        },

        "explorer" => {
            match id.next().unwrap() {
                "shortcuts" => {
                    match id.next().unwrap() {
                        "thispc" => {
                            if data["method"] == "set" {
                                // match privacy::telemetrie::disable_request_feedback() {
                                //     Ok(_) => {},
                                //     Err(e) => { error = e; } 
                                // }
                            }
                            explorer::shortcuts::get_thispc();
                            // get = privacy::telemetrie::get_request_feedback();
                        },
                        "programFolders" => {

                        },
                        _ => { error = ExecutionErrors::NotDefined; }
                    }
                },
                "folderoptions" => {
                    match id.next().unwrap() {
                        "fileextensions" => {

                        },
                        "openwith" => {

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

            if !viacommandline && utils::is_running_as_admin().unwrap() == false {

                let status = Command::new(std::env::current_exe().unwrap())
                    .arg("c")
                    .arg(data.to_string())
                    .status()
                    .expect("failed to execute");

                if data["method"] == "set" {

                    let mut c = data.clone();
                    c["method"] = serde_json::to_value("get").unwrap();
                    return router(&c, false)

                }

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