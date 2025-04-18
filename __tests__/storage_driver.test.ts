import CONSTANTS from "@/lib/constants";
import storage from "@/lib/storage";

describe("Data Store Driver", () => {
  it("verify storage", () => {
    expect(typeof storage.directory).toEqual("string");
  });

  it(`verify storage type ${CONSTANTS.STORAGE_TYPE}`, () => {
    const request_path: string[] = ["to", "directory", "test.txt"];
    const storage_path = storage.join(...request_path);
    expect(storage_path).toEqual(`${storage.directory}/to/directory/test.txt`);
  });
});
