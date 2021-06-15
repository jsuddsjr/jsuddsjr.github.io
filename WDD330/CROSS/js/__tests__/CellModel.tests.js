import CellModel from "../CellModel";

const divCell = document.createElement("div");
const divPartner = document.createElement("div");

describe("CellModel", () => {
  it("should construct", () => {
    const cell = new CellModel(divCell);
    expect(divCell.classList.contains("cell")).toBe(true);
    expect(divCell.children.length).toBe(0);
    expect(cell.shape.getShape()).toBe(".");
  });

  it("should set a number", () => {
    const cell = new CellModel(divCell);
    expect(cell.numberElement).toBeFalsy();
    cell.setClueNumber(1);
    expect(cell.numberElement).toBeTruthy();
  });

  it("cannot set self as partner", () => {
    const cell = new CellModel(divCell);
    cell.setPartnerCell(cell);
    expect(cell.partnerCell).toBeFalsy();
  });

  it("should toggle a partner cell", () => {
    const cell = new CellModel(divCell);
    cell.setPartnerCell(divPartner);
    cell.toggleBlocked();
    expect(cell.isBlocked).toBe(true);
    expect(cell.partnerCell.isBlocked).toBe(true);
  });
});
