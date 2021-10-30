

use winreg::RegKey;
use std::io;
pub use winapi::shared::minwindef::HKEY;
use crate::settings::ExecutionErrors;
use winreg::enums::{ KEY_ALL_ACCESS, HKEY_LOCAL_MACHINE };

pub fn modify (hkey: HKEY, subkey: &str, key: &str, value: u32) -> Result<bool, ExecutionErrors> {

    let hklm = RegKey::predef(hkey);

    let subkey = hklm.open_subkey_with_flags(subkey, KEY_ALL_ACCESS);
    
    match subkey {
        Ok(dc) => {
            match dc.set_value(key, &value) {
                Ok(_) => Ok(true),
                Err(e) => {
                    if e.kind() == io::ErrorKind::PermissionDenied {
                        Err(ExecutionErrors::PermissionDenied)
                    } else {
                        println!("{:?}", e);
                        Err(ExecutionErrors::Unknown)
                    }
                }
            }
        },
        Err(e) => {
            if e.kind() == io::ErrorKind::PermissionDenied {
                Err(ExecutionErrors::PermissionDenied)
            } else {
                println!("{:?}", e);
                Err(ExecutionErrors::Unknown)
            }
        }
    }

}

pub fn get_hkcu () -> winreg::RegKey {
    RegKey::predef(HKEY_LOCAL_MACHINE)
}
pub fn get_hklm () -> winreg::RegKey {
    RegKey::predef(HKEY_LOCAL_MACHINE)
}