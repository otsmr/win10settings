// let mut array: [i32; 3] = [0; 3];


// let mut thispc_keys: [str; 4] = [
//     "\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\MyComputer\\NameSpace",
//     "\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Explorer\\MyComputer\\NameSpace",
//     "\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\FolderDescriptions",
//     "\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Explorer\\FolderDescriptions"
// ]

pub mod shortcuts {

    use std::io;
    use winreg::enums::*;
    use winreg::RegKey;
    use crate::regutils;

    use crate::settings::ExecutionErrors;


    pub fn get_thispc () {

        let thispc_keys: [&str; 4] = [
            "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\MyComputer\\NameSpace",
            "SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Explorer\\MyComputer\\NameSpace",
            "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\FolderDescriptions",
            "SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Explorer\\FolderDescriptions"
        ];

        let found_items = regutils::get_hklm()
            .open_subkey(thispc_keys[0]).unwrap()
            .enum_keys().map(|x| x.unwrap());

        println!("{:?}", found_items.collect());

    }
    pub fn set_thispc () {

    }

    pub fn get_program_folders () {
        
    }
    pub fn set_program_folders () {

    }


}

pub mod folderoptions {
    pub fn get_fileextensions () {

    }
    pub fn set_fileextensions () {

    }

    pub fn get_openwith () {

    }
    pub fn set_openwith () {

    }
}