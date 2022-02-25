package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/evanw/esbuild/pkg/api"
)

func main() {
	events := make(chan struct{})

	api.Build(api.BuildOptions{
		Bundle:      true,
		EntryPoints: []string{"src/index.ts"},
		Outfile:     "dist/mainframe.js",
		Watch: &api.WatchMode{
			OnRebuild: func(result api.BuildResult) {
				if len(result.Errors) > 0 {
					fmt.Printf("watch build failed: %d errors\n", len(result.Errors))
				} else {
					fmt.Printf("watch build succeeded: %d warnings\n", len(result.Warnings))
				}
				events <- struct{}{}
			},
		},
		Write: true,
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "examples/pokemon.html")
	})
	http.HandleFunc("/events", func(w http.ResponseWriter, r *http.Request) {
		// Add headers needed for server-sent events (SSE):
		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")
		flusher, ok := w.(http.Flusher)
		if !ok {
			log.Fatalln("Your browser does not support server-sent events (SSE).")
			return
		}
		for {
			select {
			case <-events:
				// NOTE: I needed to add "data" to get server-sent events to work. YMMV.
				fmt.Fprintf(w, "event: reload\ndata\n\n")
				flusher.Flush()
			case <-r.Context().Done():
				// No-op
				return
			}
		}
	})
	http.HandleFunc("/mainframe.js", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/javascript")
		http.ServeFile(w, r, "dist/mainframe.js")
	})
	log.Println("Running on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalln(err)
	}
}
