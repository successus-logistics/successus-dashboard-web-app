import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import PostcodeTable, { PostcodeRate } from "./postcode-table";
import { useEffect, useState } from "react";
import isEqual from "lodash/isEqual";
import { Settings } from "lucide-react";
import isObject from "lodash/isObject";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface FixedFields {
  fuelPerStop: number;
  incentivePerStop: number;
  vanDeduction: number;
}

interface EditableType extends FixedFields {
  postcodeRates: PostcodeRate[];
}

interface PostcodeChanges {
  updated: {
    id: number;
    before: PostcodeRate;
    after: PostcodeRate;
  }[];
  added: PostcodeRate[];
  deleted: PostcodeRate[];
}

interface ChangedFields {
  fuelPerStop?: {
    before: number;
    after: number;
  };
  incentivePerStop?: {
    before: number;
    after: number;
  };
  vanDeduction?: {
    before: number;
    after: number;
  };
  postcodeRates?: PostcodeChanges;
}

export function getDeepDifferences(baseObj: any, comparisonObj: any): any {
  // If either isn't an object, or they are identical, return nothing
  if (!isObject(baseObj) || !isObject(comparisonObj)) return {};
  if (isEqual(baseObj, comparisonObj)) return {};

  const changes: any = {};

  // Loop through all keys in the modified object
  Object.keys(comparisonObj).forEach((key) => {
    const baseValue = baseObj[key];
    const compValue = comparisonObj[key];

    // 1. If values are exactly equal, skip it
    if (isEqual(baseValue, compValue)) return;

    // 2. If both are objects (and not arrays), recursively find nested changes
    if (
      isObject(baseValue) &&
      isObject(compValue) &&
      !Array.isArray(baseValue) &&
      !Array.isArray(compValue)
    ) {
      const nestedChanges = getDeepDifferences(baseValue, compValue);
      if (Object.keys(nestedChanges).length > 0) {
        changes[key] = nestedChanges;
      }
    } else {
      // 3. Otherwise, it's a primitive, array, or new key—grab the modified value
      changes[key] = compValue;
    }
  });

  return changes;
}

function getChangedFields(
  original: EditableType,
  updated: EditableType,
): ChangedFields {
  const changes: ChangedFields = {};

  // Simple fields
  if (!isEqual(original.fuelPerStop, updated.fuelPerStop)) {
    changes.fuelPerStop = {
      before: original.fuelPerStop,
      after: updated.fuelPerStop,
    };
  }

  if (!isEqual(original.incentivePerStop, updated.incentivePerStop)) {
    changes.incentivePerStop = {
      before: original.incentivePerStop,
      after: updated.incentivePerStop,
    };
  }

  if (!isEqual(original.vanDeduction, updated.vanDeduction)) {
    changes.vanDeduction = {
      before: original.vanDeduction,
      after: updated.vanDeduction,
    };
  }

  // Postcode rates
  const updatedPostcodes = [];
  const addedPostcodes = [];
  const deletedPostcodes = [];

  // Find updated and added records
  for (const updatedRate of updated.postcodeRates) {
    const originalRate = original.postcodeRates.find(
      (rate) => rate.id === updatedRate.id,
    );

    // New record
    if (!originalRate) {
      addedPostcodes.push(updatedRate);
      continue;
    }

    // Existing record that changed
    if (!isEqual(originalRate, updatedRate)) {
      updatedPostcodes.push({
        id: updatedRate.id,
        before: originalRate,
        after: updatedRate,
      });
    }
  }

  // Find deleted records
  for (const originalRate of original.postcodeRates) {
    const stillExists = updated.postcodeRates.some(
      (rate) => rate.id === originalRate.id,
    );

    if (!stillExists) {
      deletedPostcodes.push(originalRate);
    }
  }

  if (
    updatedPostcodes.length > 0 ||
    addedPostcodes.length > 0 ||
    deletedPostcodes.length > 0
  ) {
    changes.postcodeRates = {
      updated: updatedPostcodes,
      added: addedPostcodes,
      deleted: deletedPostcodes,
    };
  }

  return changes;
}

export default function Rules() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showChanges, setShowChanges] = useState(false);
  const [originalItems, setOriginalItems] = useState<EditableType>({
    postcodeRates: [],
    fuelPerStop: 0.4,
    incentivePerStop: 0.2,
    vanDeduction: 0.4,
  });

  const [visibleItems, setVisibleItems] = useState<EditableType>({
    postcodeRates: [],
    fuelPerStop: 0.4,
    incentivePerStop: 0.2,
    vanDeduction: 0.4,
  });

  const [changes, setChangedItems] = useState<ChangedFields>({});

  const updateItems = (values: Partial<EditableType>) => {
    setVisibleItems((prev) => {
      return { ...prev, ...values };
    });
  };

  const verifyChanges = () => {
    const result = getChangedFields(originalItems, visibleItems);
    console.log("changed", result);
    if (Object.keys(result).length > 0) {
      setShowChanges(true);
      setChangedItems(result);
    } else {
      cancelHandler();
    }
  };

  const submitChanges = async () => {
    const result = getChangedFields(originalItems, visibleItems);
    const diff = getDeepDifferences(originalItems, visibleItems);
    const response = await fetch("/api/timesheets/rules", {
      method: "POST",
      body: JSON.stringify(diff),
    });
    if (!response.ok) {
      const res = response;
      toast.error(`Failed to save. Please check values.`);
    } else {
      toast.success("Successfully updated rules.");
    }
    await cancelHandler();
  };

  const cancelHandler = async () => {
    setOpen(false);
    setShowChanges(false);
    setChangedItems({});
    await getSavedRules();
  };

  const getSavedRules = async () => {
    console.log("ping");
    const response = await fetch("/api/timesheets/rules");
    const result = await response.json();
    let postcodes = (result.postcodes as PostcodeRate[]).map((postcode) => ({
      ...postcode,
      fieldId: crypto.randomUUID(),
    }));
    setOriginalItems({
      postcodeRates: postcodes,
      fuelPerStop: result.fuel_allowance,
      incentivePerStop: result.stop_incentive,
      vanDeduction: result.van_deduction,
    });
    setVisibleItems({
      postcodeRates: postcodes,
      fuelPerStop: result.fuel_allowance,
      incentivePerStop: result.stop_incentive,
      vanDeduction: result.van_deduction,
    });
  };
  useEffect(() => {
    getSavedRules();
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (open === false) {
          cancelHandler();
        }
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button title="Update pre-defined rules" variant={"outline"}>
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {showChanges ? (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Changes</DialogTitle>
              <DialogDescription>
                Carefully verify the changes and submit when certain
              </DialogDescription>
            </DialogHeader>
            {changes.fuelPerStop && (
              <p>
                Fuel per stop:{" "}
                <span className="font-bold text-destructive">
                  £{changes.fuelPerStop.before}
                </span>{" "}
                →{" "}
                <span className="font-bold text-green-500">
                  £{changes.fuelPerStop.after}
                </span>
              </p>
            )}

            {changes.incentivePerStop && (
              <p>
                Incentive per stop:{" "}
                <span className="font-bold text-destructive">
                  £{changes.incentivePerStop.before}
                </span>{" "}
                →{" "}
                <span className="font-bold text-green-500">
                  £{changes.incentivePerStop.after}
                </span>
              </p>
            )}

            {changes.vanDeduction && (
              <p>
                Van deduction:{" "}
                <span className="font-bold text-destructive">
                  £{changes.vanDeduction.before}
                </span>{" "}
                →{" "}
                <span className="font-bold text-green-500">
                  £{changes.vanDeduction.after}
                </span>
              </p>
            )}

            {changes.postcodeRates && (
              <div>
                <h3 className="font-extrabold">Postcode rates</h3>
                <div className="flex flex-wrap gap-5">
                  {changes.postcodeRates.updated.length > 0 && (
                    <div className="border w-fit p-3 rounded-md mt-3">
                      <h4 className="font-bold">Updated</h4>

                      {changes.postcodeRates.updated.map((change) => (
                        <div key={change.id} className="mt-3">
                          <p className="flex place-items-center gap-3">
                            Postcode:{" "}
                            <span className="text-red-500">
                              {change.before.postcode}
                            </span>{" "}
                            →{" "}
                            <span className="text-green-500">
                              {change.after.postcode}
                            </span>
                          </p>

                          <p className="flex place-items-center gap-3">
                            Rate:{" "}
                            <span className="text-red-500">
                              {change.before.rate}
                            </span>{" "}
                            →{" "}
                            <span className="text-green-500">
                              {change.after.rate}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    {changes.postcodeRates.added.length > 0 &&
                      changes.postcodeRates.added.map((rate, id) => (
                        <div
                          key={id}
                          className="border w-fit p-3 rounded-md mt-3"
                        >
                          <h4>Added</h4>

                          <div>
                            <div>
                              Effective From:{" "}
                              <p className="inline text-green-500">
                                {rate.effective_from}
                              </p>
                            </div>
                            <div>
                              Postcoded:{" "}
                              <p className="inline text-green-500">
                                {rate.postcode}
                              </p>
                            </div>
                            <div>
                              Rate:{" "}
                              <p className="inline text-green-500">
                                £{rate.rate}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {changes.postcodeRates.deleted.length > 0 &&
                    changes.postcodeRates.deleted.map((rate) => (
                      <div
                        className="border w-fit p-3 rounded-md mt-3"
                        key={rate.id}
                      >
                        <h4>Removed</h4>

                        <div>
                          <p className="text-red-500">
                            {rate.postcode} — {rate.rate}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant={"outline"}
                onClick={() => {
                  setShowChanges(false);
                }}
              >
                &larr; back
              </Button>
              <Button type="submit" variant={"default"} onClick={submitChanges}>
                Submit
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Predifined Rules</DialogTitle>
              <DialogDescription>
                Pre-define the rules for the timesheet
              </DialogDescription>
            </DialogHeader>

            <div
              className="flex flex-col gap-5"
              onSubmit={(event) => event.preventDefault()}
            >
              <FieldGroup>
                <Field>
                  <PostcodeTable
                    postcodeRates={visibleItems.postcodeRates}
                    onChange={(value: PostcodeRate[]) =>
                      updateItems({ postcodeRates: value })
                    }
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-3 mt-5">
                  <Field>
                    <FieldLabel htmlFor="fuel-field">
                      Fuel Allowance (per stop)
                    </FieldLabel>
                    <Input
                      id="fuel-field"
                      defaultValue={visibleItems.fuelPerStop}
                      type="number"
                      onChange={(e) =>
                        updateItems({
                          fuelPerStop: Number(e.currentTarget.value),
                        })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="incentive-field">
                      Incentive (per stop)
                    </FieldLabel>
                    <Input
                      id="incentive-field"
                      defaultValue={visibleItems.incentivePerStop}
                      type="number"
                      onChange={(e) =>
                        updateItems({
                          incentivePerStop: Number(e.currentTarget.value),
                        })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="van-deduc-field">
                      Van Deductions (per day)
                    </FieldLabel>
                    <Input
                      id="van-deduc-field"
                      defaultValue={visibleItems.vanDeduction}
                      type="number"
                      onChange={(e) =>
                        updateItems({
                          vanDeduction: Number(e.currentTarget.value),
                        })
                      }
                    />
                  </Field>
                </div>
              </FieldGroup>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"outline"} onClick={cancelHandler}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant={"default"} onClick={verifyChanges}>
                Submit
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
