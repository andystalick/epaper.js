import { ColorMode, DisplayDevice, Monochrome, Orientation } from '@epaperjs/core';
import { ImageOptions } from '@epaperjs/core/src/image/imageOptions';
import bindings from 'bindings';
import { Driver } from './driver';

export class Rpi7In5BC implements DisplayDevice {
    public readonly height: number;
    public readonly width: number;
    private readonly driver: Driver;
    private sleeping = true;
    constructor(public readonly orientation = Orientation.Horizontal, public readonly colorMode = ColorMode.Black) {
        const supportedColorModes = [ColorMode.Black, ColorMode.Red];
        if (!supportedColorModes.includes(colorMode)) {
            throw new Error(`Only color modes: [${supportedColorModes}] are supported`);
        }
        this.driver = bindings('waveshare7in5bc');
        this.width = this.orientation === Orientation.Horizontal ? 800 : 480;
        this.height = this.orientation === Orientation.Horizontal ? 480 : 800;
    }

    public connect(): void {
        this.driver.dev_init();
        this.wake();
    }

    public disconnect(): void {
        this.sleep();
        this.driver.dev_exit();
    }

    public wake(): void {
        this.driver.init();
        this.sleeping = false;
    }

    public clear(): void {
        this.driver.clear();
    }

    public sleep(): void {
        if (!this.sleeping) {
            this.driver.sleep();
            this.sleeping = true;
        }
    }

    public async displayPng(img: Buffer, options?: ImageOptions) {
        const converter = new Monochrome(img);
        const blackBuffer = await converter.toBlack({
            ...options,
            rotate90Degrees: this.orientation === Orientation.Horizontal,
        });
        const redBuffer =
            this.colorMode === ColorMode.Red
                ? await converter.toRed({ ...options, rotate90Degrees: this.orientation === Orientation.Horizontal })
                : Buffer.alloc(blackBuffer.length, 0xff);
        this.driver.display(blackBuffer, redBuffer);
    }
}
