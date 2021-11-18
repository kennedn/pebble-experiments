#include <pebble.h>

static Window *window;

static void window_load(Window *window) {
  window_set_background_color(window, GColorIslamicGreen);
}

static void init(void) {
  window = window_create();
  window_set_window_handlers(window, (WindowHandlers) {
	.load = window_load,
  });
  window_stack_push(window, true);
}

static void deinit(void) {
  window_destroy(window);
}

int main(void) {
  init();
  app_event_loop();
  deinit();
}
