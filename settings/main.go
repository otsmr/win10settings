package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net"
	"strconv"
	"strings"
	"time"

	"github.com/webview/webview"
)

type Settings struct {
	Port int
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

func is_port_available(port int) bool {

	ln, err := net.Listen("tcp", ":"+strconv.Itoa(port))

	if err != nil {
		return false
	}

	ln.Close()

	return true
}

func start_webview(port int) {

	isdev := true

	url := "http://localhost:" + strconv.Itoa(port)

	w := webview.New(isdev)
	defer w.Destroy()

	w.SetTitle("Erweiterte Windows-Einstellungen")
	w.SetSize(800, 600, webview.HintNone)

	w.Navigate(url)
	w.Run()

}

func main() {

	settings := get_settings()
	auth_token := generate_random_token(30)

	for settings.Port < settings.Port+100 {

		if is_port_available(settings.Port) {
			break
		}
		settings.Port++

	}

	fmt.Println(auth_token)
	// start_webview(settings.Port)

}
