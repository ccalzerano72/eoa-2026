import { Question } from "../types";
import { block1Questions } from "./block-1";
import { block2Questions } from "./block-2";
import { block3Questions } from "./block-3";
import { block4Questions } from "./block-4";
import { block5Questions } from "./block-5";
import { block6Questions } from "./block-6";
import { block7Questions } from "./block-7";

export const allSeedQuestions: Question[] = [
  ...block1Questions,
  ...block2Questions,
  ...block3Questions,
  ...block4Questions,
  ...block5Questions,
  ...block6Questions,
  ...block7Questions,
];

export {
  block1Questions,
  block2Questions,
  block3Questions,
  block4Questions,
  block5Questions,
  block6Questions,
  block7Questions,
};
