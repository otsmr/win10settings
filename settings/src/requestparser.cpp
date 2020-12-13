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
#include <string>
#include "requestparser.h"

RequestParser::RequestParser() {
    reset();
}

void RequestParser::reset() {
    half_end_of_line = false;
    end_of_line = false;
    first_line = true;
    beginning = true;

    method = "";
    path = "";
    proto_ver = "";

    tmp_header_name = "";
    tmp_header_value = "";

    previous_char = '\0';
    prev_char = '\0';

    headers.clear();
    headers_available = false;
    beginbody = false;
    body = "";

    charcount = -1;

    parsingDone = false;
}

void RequestParser::processChunk(const char *buf, size_t size) {
    char c;
    size_t i = 0;
    c = buf[i];
    for(; i < size; ++i, c = buf[i]) {
        if(c == '\r') {
            half_end_of_line = true;
            goto next_iter;
        } else if(half_end_of_line && c == '\n') {
            if(end_of_line) {
                headers_available = true;
            } else {
                if(!first_line) {
                    headers[tmp_header_name] = tmp_header_value;
                    tmp_header_name = "";
                    tmp_header_value = "";
                }
                end_of_line = true;
                first_line = false;
                goto next_iter;
            }
        }
        if(first_line) {
            static int field = 0;
            if(beginning || end_of_line) {
                field = 0;
            }

            if(c == ' ') {
                field++;
            } else {
                switch(field) {
                case 0:
                    method += c;
                    break;

                case 1:
                    path += c;
                    break;

                case 2:
                    proto_ver += c;
                    break;
                }
            }
        } else {
            static int field = 0;
            if(end_of_line) {
                field = 0;
            }

            switch(field) {
            case 0:
                if(c == ' ' && previous_char == ':') {
                    tmp_header_name.pop_back();
                    field++;
                } else {
                    tmp_header_name += c;
                }
                break;

            case 1:
                tmp_header_value += c;
                break;
            }
        }
        half_end_of_line = false;
        end_of_line = false;
next_iter:
        previous_char = c;
        beginning = false;

        /* --- begin extended code for body parser --- */

        if(c == '\n' && prev_char == '\r') {
            if(i+2 < size) {
                if( buf[i+1] == '\r' && buf[i+2] == '\n' ) {
                    beginbody = true;
                }
            }
        }

        if(charcount == -1) {
            auto size_it = headers.find("Content-Length");
            if(size_it != headers.end()) {
                charcount = stoi(size_it->second);
            }
        }
        if(headers_available && method == "GET") { // GET request
            parsingDone = true;
        }

        if(beginbody) {
            body += buf[i];
            if(charcount == body.size()) {
                parsingDone = true;
            }
        }

        prev_char = c; 

        /* --- / end extended code for body parser --- */
    }
    

}

bool RequestParser::allHeadersAvailable() {
    return headers_available;
}

std::map<std::string, std::string> RequestParser::getHeaders() {
    return headers;
}

std::string RequestParser::getMethod() {
    return method;
}

std::string RequestParser::getPath() {
    return path;
}

std::string RequestParser::getProtocol() {
    return proto_ver;
}

std::string RequestParser::getBody() {
    return body;
}

bool RequestParser::isParsingDone() {
    return parsingDone;
}

std::string RequestParser::getHeader(std::string key) {
    return headers.find(key) == headers.end() ? "" : headers[key];
}
