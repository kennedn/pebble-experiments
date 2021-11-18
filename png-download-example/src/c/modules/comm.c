#include "c/modules/comm.h"

typedef enum {
  AppKeyIndex = 0,   // Index of data chunk in whole array
  AppKeyDataLength,  // Length of the array being transmitted
  AppKeyDataChunk,   // The chunk of image data
  AppKeyChunkSize,   // Size of any particular chunk
  AppKeyComplete     // Signal that all data has been transferred
} AppKey;

static uint8_t *s_img_data;
static int s_img_size;

static void inbox_received_handler(DictionaryIterator *iter, void *context) {
  APP_LOG(APP_LOG_LEVEL_DEBUG, "Received Chunk");
  // Get the received image chunk
  Tuple *img_size_t = dict_find(iter, AppKeyDataLength);
  if(img_size_t) {
    s_img_size = img_size_t->value->int32;

    // Allocate buffer for image data
    s_img_data = (uint8_t*)malloc(s_img_size * sizeof(uint8_t));
  }

  // An image chunk
  Tuple *chunk_t = dict_find(iter, AppKeyDataChunk);
  if(chunk_t) {
    uint8_t *chunk_data = chunk_t->value->data;

    Tuple *chunk_size_t = dict_find(iter, AppKeyChunkSize);
    int chunk_size = chunk_size_t->value->int32;

    Tuple *index_t = dict_find(iter, AppKeyIndex);
    int index = index_t->value->int32;

    // Save the chunk
    memcpy(&s_img_data[index], chunk_data, chunk_size);
  }

  // Complete?
  Tuple *complete_t = dict_find(iter, AppKeyComplete);
  if(complete_t) {
    // Show the image
    main_window_set_image_data(s_img_data, s_img_size);
  }
}

void comm_init() {
  app_message_register_inbox_received(inbox_received_handler);

  const int inbox_size = app_message_inbox_size_maximum();
  const int outbox_size = 64;
  app_message_open(inbox_size, outbox_size);
}

void comm_deinit() {
  // Free image data buffer
  if(s_img_data) {
    free(s_img_data);
  }
}
