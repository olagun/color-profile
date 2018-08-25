"use strict";

const program = require("commander");
const Canvas = require("canvas");
const fs = require("fs");
const chalk = require("chalk");

const JPEG = "JPEG";
const PNG = "PNG";

program
  .version("1.0.0")
  .option("-c, --color [color]", "color of the image")
  .option("-s, --size [size]", "size of the image")
  .option("-n, --fname [fname]", "image name")
  .option("-p, --png", "output a png")
  .parse(process.argv);

const { color = "000", size = 500, fname = "out", png = false } = program;

const canvas = new Canvas(size, size);
const ctx = canvas.getContext("2d");

ctx.fillStyle = /^rgba?.*/.test(color) ? color : "#" + color;
ctx.fillRect(0, 0, size, size);

const type = png ? PNG : JPEG;
const path = __dirname + `/${fname}.${type === PNG ? "png" : "jpeg"}`;
const out = fs.createWriteStream(path);
const stream = type === PNG ? canvas.pngStream() : canvas.jpegStream();

stream.on("data", chunk => {
  out.write(chunk);
});

stream.on("end", () => {
  console.log(
    `${chalk.green("✔")} ${chalk.blue(
      `Saved ${chalk.cyan(fname)} as a ${chalk.cyan(
        type.toLocaleLowerCase()
      )} to ${chalk.cyan(path)}`
    )}`
  );
});
