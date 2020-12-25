package main

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
)

func demoRes(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("admin: index"))
}

func apiRouter() chi.Router {
	r := chi.NewRouter()
	// r.Use(VerifyRequest)

	r.Route("/privacy", func(r chi.Router) {

		r.Route("/telemetrie/", func(r chi.Router) {
			r.Get("/allowtelemetry", demoRes)
			r.Post("/allowtelemetry", demoRes)
		})

	})

	r.Get("/{a}/{b}/{c}", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("TODO: ", chi.URLParam(r, "a"), chi.URLParam(r, "b"), chi.URLParam(r, "c"))
	})

	return r
}
