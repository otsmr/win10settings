// MIT License

// Copyright (c) 2018 Neutralinojs

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

#include <iostream>
#include <fstream>
#ifndef __has_include
  static_assert(false, "__has_include not supported");
#else
#  if __has_include(<filesystem>)
#    include <filesystem>
     namespace fs = std::filesystem;
#  elif __has_include(<experimental/filesystem>)
#    include <experimental/filesystem>
     namespace fs = std::experimental::filesystem;
#  endif
#endif
#include "../lib/json/json.hpp"
#include "auth/authbasic.h"
#include "log.h"

using namespace std;
using json = nlohmann::json;
json options;

namespace settings {

    string getFileContent(string filename){
        ifstream t;
        t.open(filename);
        if(!t.is_open())
            return "";
        string buffer = "";
        string line;
        while(!t.eof()){
            getline(t, line);
            buffer += line + "\n";
        }
        t.close();
        return buffer;
    }

    string getFileContentBinary(string filename){
        vector<char> buffer;
        ifstream ifd(filename.c_str(), ios::binary | ios::ate);
        if(!ifd.is_open())
            return "";
        int size = ifd.tellg();
        ifd.seekg(0, ios::beg);
        buffer.resize(size);
        ifd.read(buffer.data(), size);
        string result(buffer.begin(), buffer.end());
        return result;
    }

    string getCurrentDir() {
        return fs::current_path().generic_string();
    }

    json getOptions(){
        return options;
    }

    void setOption(string key, string value) {
        options[key] = value;
    }

    json getSettings() {
        json settings;
        try {
            settings = json::parse(getFileContent("app\\settings.json"));
        }
        catch(exception e){
            ERROR() << e.what();
        }
        options = settings;
        return options;
    }

    string getGlobalVars(){
        json settings = getOptions();
        string s = "var NL_OS='Windows';";
        s += "var NL_VERSION='1.6.0';";
        s += "var NL_NAME='" + settings["appname"].get<std::string>() + "';"; 
        s += "var NL_PORT=" + settings["appport"].get<std::string>() + ";";
        s += "var NL_MODE='" + settings["mode"].get<std::string>() + "';";
        s += "var NL_TOKEN='" + authbasic::getToken() + "';";  
        s += "var NL_CWD='" + settings::getCurrentDir() + "';";

        if(settings["globals"] != NULL) {
            for ( auto it: settings["globals"].items()) {
                s += "var NL_" + it.key() +  "='" + it.value().get<std::string>() + "';";
            }
        }
        return s;
    }

}
