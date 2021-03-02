import { ShorteningService } from "../../services/shorteningService";
import { expect } from "chai";

describe("ShorteningService", () => {
  it("Returns a promise ", () => {
    const service = new ShorteningService();
    const shorten = service.shortenUrl("");
    expect(shorten instanceof Promise).to.be.true;
  });
});
