import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationFactory } from "../factories/recommendationFactory";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("insert", () => {
  it("Must throw conflictError", async () => {
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {
        return recommendationFactory();
      });
    const recommendation = recommendationFactory();

    const promise = recommendationService.insert(recommendation);

    expect(promise).rejects.toEqual({
      type: "conflict",
      message: "Recommendations names must be unique",
    });
  });

  it("Must call the function create from recommendationRepository file", async () => {
    const recommendation = recommendationFactory();
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {
        return false;
      });
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => {
        return recommendation;
      });

    await recommendationService.insert(recommendation);

    expect(recommendationRepository.create).toBeCalled();
  });
});

describe("upvote", () => {
  it("Must throw error not found", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return false;
      });
    const id = 5;

    const promise = recommendationService.upvote(id);

    expect(promise).rejects.toEqual({ type: "not_found", message: "" });
  });

  it("Must call function updateScore from recommendationRepository file with 'increment' as argument", async () => {
    const recommendation = recommendationFactory();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return recommendation;
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((id, operation): any => {
        return operation;
      });

    const id = 3;

    await recommendationService.upvote(id);

    expect(recommendationRepository.updateScore).toBeCalledWith(
      id,
      "increment"
    );
  });
});

describe("downvote", () => {
  it("Must throw error not found", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return false;
      });
    const id = 99;

    const promise = recommendationService.upvote(id);

    expect(promise).rejects.toEqual({ type: "not_found", message: "" });
  });

  it("Must call function updateScore from recommendationRepository file with 'decrement' as argument and do not delete the recommendation", async () => {
    const recommendation = recommendationFactory();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return recommendation;
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((id, operation): any => {
        return id;
      });
    jest.spyOn(recommendationRepository, "remove");

    const id = 99;

    await recommendationService.downvote(id);

    expect(recommendationRepository.updateScore).toBeCalledWith(
      id,
      "decrement"
    );
    expect(recommendationRepository.remove).not.toBeCalled();
  });

  it("Must call function updateScore from recommendationRepository file with 'decrement' as argument and delete the recommendation", async () => {
    const recommendation = recommendationFactory();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return recommendation;
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return { score: -6 };
      });
    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {
        return {};
      });

    const id = 1;

    await recommendationService.downvote(id);

    expect(recommendationRepository.updateScore).toBeCalledWith(
      id,
      "decrement"
    );
    expect(recommendationRepository.remove).toBeCalled();
  });
});

describe("get", () => {
  it("Must get the return of function findAll from recommendationRepository file", async () => {
    const recommendation = recommendationFactory();
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return recommendation;
      });

    const result = await recommendationService.get();

    expect(result).toEqual(recommendation);
  });
});

describe("getTop", () => {
  it("Must get the return of function getAmountByScore from recommendationRepository file and call this same function with the amount passed as argument same as the getTop argument", async () => {
    const recommendation = recommendationFactory();
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockImplementationOnce((): any => {
        return recommendation;
      });

    const amount = 7;

    const result = await recommendationService.getTop(amount);

    expect(result).toEqual(recommendation);
    expect(recommendationRepository.getAmountByScore).toBeCalledWith(amount);
  });
});

describe("getRandom", () => {
  it("Must throw error not found", async () => {
    const recommendation = [];
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementation((): any => {
        return recommendation;
      });

    const promise = recommendationService.getRandom();

    expect(promise).rejects.toEqual({ type: "not_found", message: "" });
  });

  it("Must call function findAll with scoreFilter = 'lte' and return the last element of recommendation array", async () => {
    const recommendation = [
      { ...recommendationFactory(), id: 1 },
      { ...recommendationFactory(), id: 2 },
      { ...recommendationFactory(), id: 3 },
    ];
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementation((): any => {
        return recommendation;
      });

    jest.spyOn(Math, "random").mockImplementation((): any => {
      return 0.9;
    });

    const result = await recommendationService.getRandom();

    expect(result.id).toEqual(3);
    expect(recommendationRepository.findAll).toBeCalledWith({
      score: 10,
      scoreFilter: "lte",
    });
  });

  it("Must call function findAll with scoreFilter = 'gt' and return the first element of recommendation array", async () => {
    const recommendation = [
      { ...recommendationFactory(), id: 1 },
      { ...recommendationFactory(), id: 2 },
      { ...recommendationFactory(), id: 3 },
    ];
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementation((): any => {
        return recommendation;
      });

    jest.spyOn(Math, "random").mockImplementation((): any => {
      return 0.2;
    });

    const result = await recommendationService.getRandom();

    expect(result.id).toEqual(1);
    expect(recommendationRepository.findAll).toBeCalledWith({
      score: 10,
      scoreFilter: "gt",
    });
  });
});
