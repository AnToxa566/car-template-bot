import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { IChannel } from "./channel.interface.js";

class ChannelService {
  private __dirname = dirname(fileURLToPath(import.meta.url));

  private fileName = this.__dirname + "/channels.data.json";

  private channels: IChannel[] = [];

  async findAll(): Promise<IChannel[]> {
    try {
      const response = await fs.promises.readFile(this.fileName);
      this.channels = JSON.parse(response.toString() || "[]");
    } catch {}

    return this.channels;
  }

  create(channel: IChannel): IChannel {
    fs.stat(this.fileName, (err) => {
      if (err === null) {
        fs.readFile(this.fileName, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            this.channels = JSON.parse(data.toString() || "[]");
            this.channels.push(channel);

            fs.writeFile(
              this.fileName,
              JSON.stringify(this.channels),
              () => {}
            );
          }
        });
      } else if (err.code === "ENOENT") {
        const json = JSON.stringify([channel]);
        fs.writeFile(this.fileName, json, () => {});
      } else {
        console.log("Some other error: ", err.code);
      }
    });

    return channel;
  }
}

export const channelService = new ChannelService();
