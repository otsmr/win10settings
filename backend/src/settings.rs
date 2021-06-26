
use serde_json::json;
use crate::config;


struct App {}

impl App {

    fn setting_get_theme_mode () -> serde_json::Value {

        let configs = config::get_config();
        return json!(configs["theme"].as_str());
    }

    fn setting_set_theme_mode (mode: &str) {

        let mut configs = config::get_config();

        configs["theme"] = serde_json::Value::from(mode);

        config::update_config(configs).unwrap();

    }

}


pub fn router(data: &serde_json::Value) -> Result<serde_json::Value, String> {

    println!("{}", data);

    let id = data["id"].as_str().unwrap().to_string();
    let mut id = id.split(":");

    // println!("{}", id.next().unwrap());

    let mut result = json!({});
    let mut error = false; 

    match id.next().unwrap() {

        "app" => {

            match id.next().unwrap() {

                "gereral" => {
                    
                    
                    match id.next().unwrap() {

                        "theme" => {

                            if data["method"] == "set" {
                                let body = data["body"]["value"].as_str().unwrap();
                                App::setting_set_theme_mode(body);
                            }
                            
                            result = App::setting_get_theme_mode();
                            
                        },
                        _ => {
                            error = true;
                            println!("1. Einstellung nicht gefunden")
                        }

                    }



                },
                _ => {
                    error = true;
                    println!("2. Einstellung nicht gefunden")
                }
            }

        },
        _ => { 
            error = true;
            println!("3. Einstellung nicht gefunden");
        }

    }

    Ok(json!({
        "error": error,
        "data": result
    }))

}