

pub mod telemetrie {

    use std::io;
    use std::path::Path;
    use winreg::enums::*;
    use winreg::RegKey;

    use crate::settings::ExecutionErrors;
    
    

    pub fn get_allow_telemetry () -> io::Result<bool> {

        let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);

        let data_collection = hklm.open_subkey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\DataCollection")?;

        let at: u32 = data_collection.get_value("AllowTelemetry").unwrap_or(0);

        Ok(at == 0)

    }

    pub fn set_allow_telemetry (enable: bool) -> Result<bool, ExecutionErrors> {

        let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);

        let data_collection = hklm.open_subkey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\DataCollection");
        // let at: u32 = if enable {1} else {0};

        match data_collection {
            Ok(dc) => {

                match dc.set_value("AllowTelemetry", &1u32) {
                    Ok(_) => Ok(true),
                    Err(e) => {
                        println!("{:?}", e);
                        if e.kind() == io::ErrorKind::PermissionDenied {
                            Err(ExecutionErrors::PermissionDenied)
                        } else {
                            Err(ExecutionErrors::Unknown)
                        }
                    }
                }
                
            },
            Err(_) => {
                return Err(ExecutionErrors::Unknown)
            }
        }

    }

}