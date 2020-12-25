package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi"
)

func FileServer(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit any URL parameters.")
	}

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, func(w http.ResponseWriter, r *http.Request) {
		rctx := chi.RouteContext(r.Context())
		pathPrefix := strings.TrimSuffix(rctx.RoutePattern(), "/*")
		fs := http.StripPrefix(pathPrefix, http.FileServer(root))
		fs.ServeHTTP(w, r)
	})
}

func get_next_free_port(port int) int {

	for port < port+100 {

		ln, err := net.Listen("tcp", ":"+strconv.Itoa(port))

		if err != nil {
			port++
			continue
		}

		ln.Close()
		break
	}

	return port

}

func get_settings() Settings {

	settings := Settings{}

	data, err := ioutil.ReadFile("./settings.json")
	if err != nil {
		fmt.Println("error:", err)
		return settings
	}

	err = json.Unmarshal(data, &settings)
	if err != nil {
		fmt.Println("error:", err)
	}

	return settings

}

func generate_random_token(length int) string {

	rand.Seed(time.Now().Unix())

	charSet := "abcdefghijklmnopqrstuvwxyz0123456789"
	var output strings.Builder
	for i := 0; i < length; i++ {
		random := rand.Intn(len(charSet))
		randomChar := charSet[random]
		output.WriteString(string(randomChar))
	}

	return output.String()

}
