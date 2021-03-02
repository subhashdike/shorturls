import * as crc from "crc";
import { v4 } from "uuid";

import { Url, IUrl } from "../models/url";
export class ShorteningService {
  shortenUrl(url: string): Promise<IUrl> {
    return new Promise((resolve, reject) => {
      const slug = crc.crc32(`${this.getRandomString()}${url}`).toString(16);
      /**
       * Adding random string here so that even if different users submit the same url (same time or otherwise), they still get different slugs returned
       */
      const newDocument = new Url();
      newDocument.slug = slug;
      newDocument.fullUrl = url;
      newDocument
        .save()
        .then((savedDocument) => {
          resolve(savedDocument);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private getRandomString() {
    return v4();
  }
}
