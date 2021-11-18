#include <pebble.h>

#include "c/modules/comm.h"

#include "c/windows/main_window.h"

static void init() {
  comm_init();
  main_window_push();
}

static void deinit() { 
  comm_deinit();
}

int main() {
  init();
  app_event_loop();
  deinit();
}
