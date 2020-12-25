package main

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"sync"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/webview/webview"
)

type Settings struct {
	Port     int
	LogLevel string
}

func log(msg string) {
	// TODO:
}

func start_webview(settings Settings, wg *sync.WaitGroup) {

	defer wg.Done()

	url := "http://localhost:" + strconv.Itoa(settings.Port)

	fmt.Println("[webview] open " + url)

	showLog := false
	if settings.LogLevel == "verbose" {
		showLog = true
	}

	w := webview.New(showLog)
	defer w.Destroy()

	w.SetTitle("Erweiterte Windows-Einstellungen")
	w.SetSize(800, 600, webview.HintNone)

	w.Navigate(url)
	w.Run()

}

func start_httpserver(port int, wg *sync.WaitGroup) {

	defer wg.Done()

	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Mount("/api", apiRouter())

	workDir, _ := os.Getwd()
	filesDir := http.Dir(filepath.Join(workDir, "app"))
	FileServer(r, "/app", filesDir)

	fmt.Println("[http server] listen to http://127.0.0.1:" + strconv.Itoa(port))
	http.ListenAndServe("127.0.0.1:"+strconv.Itoa(port), r)

}

func main() {

	settings := get_settings()
	auth_token := generate_random_token(30)

	fmt.Println(auth_token)

	settings.Port = get_next_free_port(settings.Port)

	var wg sync.WaitGroup

	wg.Add(2)
	go start_httpserver(settings.Port, &wg)
	go start_webview(settings, &wg)

	wg.Wait()

}
