
pub mod telemetrie {

    use std::io;
    use winreg::enums::*;
    use winreg::RegKey;
    use crate::regutils;

    use crate::settings::ExecutionErrors;
    
    pub fn get_allow_telemetry () -> io::Result<bool> {
        let key = regutils::get_hkcu()
            .open_subkey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\DataCollection")?;
        let at: u32 = key.get_value("AllowTelemetry").unwrap_or(0);
        Ok(at == 0)
    }

    pub fn set_allow_telemetry (enable: bool) -> Result<bool, ExecutionErrors> {
        let at: u32 = if enable {0} else {1};
        regutils::modify(HKEY_LOCAL_MACHINE, "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\DataCollection", "AllowTelemetry", at)
    }


    pub fn get_request_feedback () -> io::Result<bool> {

        let key = RegKey::predef(HKEY_CURRENT_USER)
            .open_subkey("Software\\Microsoft\\Siuf\\Rules")?;

        let number_of_suif_in_period: u32 = key.get_value("NumberOfSIUFInPeriod").unwrap_or(0);
        let period_in_nano_seconds: u32 = key.get_value("PeriodInNanoSeconds").unwrap_or(0);

        Ok( number_of_suif_in_period == 0 &&
            period_in_nano_seconds == 0 )

    }

    pub fn disable_request_feedback () -> Result<bool, ExecutionErrors> {

        match regutils::modify(HKEY_CURRENT_USER, "Software\\Microsoft\\Siuf\\Rules", "NumberOfSIUFInPeriod", 0u32) {
            Ok(_) => {
                return regutils::modify(HKEY_CURRENT_USER, "Software\\Microsoft\\Siuf\\Rules", "PeriodInNanoSeconds", 0u32)
            }
            Err(e) => Err(e)
        }
        
    }

    /*
        1, 2: WerbeID
        3: Zugriff auf die eigene Sprachliste
        4: Windows erlauben, das Starten von Apps nachzuverfolgen, um Start und Suchergebnisse zu verbessern        
    */

    pub fn get_basic_privacy_settings () -> io::Result<bool> {

        let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
        let hkcu = regutils::get_hkcu();
            
        let adinfo: u32 = hklm.open_subkey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo")?.get_value("Enabled").unwrap_or(1);
        let dbgp: u32 = hklm.open_subkey("SOFTWARE\\Policies\\Microsoft\\Windows\\AdvertisingInfo")?.get_value("DisabledByGroupPolicy").unwrap_or(0);
        let halou: u32 = hkcu.open_subkey("Control Panel\\International\\User Profile")?.get_value("HttpAcceptLanguageOptOut").unwrap_or(0);
        let stp: u32 = hkcu.open_subkey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced")?.get_value("Start_TrackProgs").unwrap_or(1);

        Ok( adinfo == 0 &&
            dbgp == 1 &&
            halou == 1 &&
            stp == 0
        )

    }

}