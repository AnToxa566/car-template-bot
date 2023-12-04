import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { IChannel } from "./channel.interface.js";

class ChannelService {
  private __dirname = dirname(fileURLToPath(import.meta.url));

  private fileName = this.__dirname + "/channels.data.json";

  private channels: IChannel[] = [];

  async findAll(props?: { chatId?: string }): Promise<IChannel[]> {
    try {
      const response = await fs.promises.readFile(this.fileName);
      this.channels = JSON.parse(response.toString() || "[]");

      if (props?.chatId) {
        this.channels = this.channels.filter(
          (ch) => ch.user_id === props.chatId
        );
      }
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

  async update(channel: IChannel) {
    this.channels = await this.findAll();
    this.channels = this.channels.filter((ch) => ch.id !== channel.id);

    await fs.promises.writeFile(
      this.fileName,
      JSON.stringify([...this.channels, channel])
    );
  }

  async delete(id: string) {
    this.channels = await this.findAll();
    this.channels = this.channels.filter((ch) => ch.id !== id);

    await fs.promises.writeFile(this.fileName, JSON.stringify(this.channels));
  }
}

export const channelService = new ChannelService();
