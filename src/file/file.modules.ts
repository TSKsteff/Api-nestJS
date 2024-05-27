import { Module } from "@nestjs/common";
import { FileService } from "./file.services";

@Module({
    providers: [FileService],
    exports: [FileService]
})
export class FileModule{}