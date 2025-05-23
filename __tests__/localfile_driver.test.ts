import { LocalFileSystemDriver } from "@/lib/data-store/local-file-system";

describe("LocalFile Data Store Driver", () => {
  let datastore = new LocalFileSystemDriver();
  it("initial constructor", async () => {
    expect(datastore).toBeInstanceOf(LocalFileSystemDriver);
  });

  it("method writeFile()", async () => {
    await datastore.writeFile("_temp_/test.txt", "Hello World");
    expect(await datastore.readFile("_temp_/test.txt", "utf-8")).toEqual(
      "Hello World"
    );
    expect(typeof (await datastore.readFile("_temp_/test.txt"))).toEqual(
      "object"
    );
    await datastore.writeFile("_temp_/deepinside/test.txt", "Hello World");
    expect(
      await datastore.readFile("_temp_/deepinside/test.txt", "utf-8")
    ).toEqual("Hello World");
  });

  it("method mkdir()", async () => {
    await datastore.mkdir("_temp_", true);
    await datastore.mkdir("_temp_/temp_dir", true);
    const isExists = await datastore.exists("_temp_/temp_dir");
    expect(isExists).toEqual(true);
  });

  it("method exist() directory type", async () => {
    expect(await datastore.exists("_temp_")).toEqual(true);
    expect(await datastore.exists("_temp_/test.txt")).toEqual(true);
    expect(await datastore.exists("_temp_/deepinside/test.txt")).toEqual(true);
    expect(
      await datastore.exists("_temp_/deepinside/test_not_found.txt")
    ).toEqual(false);
  });

  it("method exist() file type", async () => {
    const isExists = await datastore.exists("_temp_/test.txt");
    expect(isExists).toEqual(true);
  });

  it("method readdir()", async () => {
    const files = await datastore.readdir("_temp_");
    expect(files.length).toBeGreaterThan(0);
  });

  it("method readFile()", async () => {
    const data = await datastore.readFile("_temp_/test.txt");
    expect(data).toBeDefined();
  });

  it("method stat()", async () => {
    let data = await datastore.stat("_temp_/test.txt");
    expect(data).toBeDefined();
    data = await datastore.stat("_temp_/deepinside/test.txt");
    expect(data).toBeDefined();
    data = await datastore.stat("_temp_/deepinside/_no_data_test.txt");
    expect(data).toBeUndefined();
  });

  it("method rm()", async () => {
    await datastore.rm("_temp_/test.txt");
    expect(await datastore.exists("_temp_/test.txt")).toEqual(false);
    await datastore.rm("_temp_/deepinside/test.txt");
    expect(await datastore.exists("_temp_/deepinside/test.txt")).toEqual(false);
    await datastore.rm("_temp_", true);
    expect(await datastore.exists("_temp_")).toEqual(false);
  });
});
