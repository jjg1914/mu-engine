import { Behavior } from "../behaviors/behavior";
import { IdleBehavior } from "../behaviors/idle-behavior";
import { RepeatBehavior } from "../behaviors/repeat-behavior";
import { ParallelBehavior } from "../behaviors/parallel-behavior";
import {
  PhaseBehavior,
  PhaseBehaviorConfig,
} from "../behaviors/phase-behavior";
import { SelectBehavior } from "../behaviors/select-behavior";
import { SequenceBehavior } from "../behaviors/sequence-behavior";
import { WhilstBehavior } from "../behaviors/whilst-behavior";

export interface BehaviorDSLLeaf {
  leaf: Behavior | (() => Behavior);
}

export interface BehaviorDSLIdle {
  idle: undefined;
}

export interface BehaviorDSLRepeat {
  repeat: BehaviorDSL;
}

export interface BehaviorDSLParallel {
  parallel: BehaviorDSL[];
}

export interface BehaviorDSLSelect {
  select: BehaviorDSL[];
}

export interface BehaviorDSLSequence {
  sequence: BehaviorDSL[];
}

export interface BehaviorDSLWhilst {
  whilst: BehaviorDSL;
  loop: BehaviorDSL;
}

export interface BehaviorDSLPhase {
  phase: BehaviorDSL;
  params: PhaseBehaviorConfig;
}

export type BehaviorDSL = BehaviorDSLLeaf |
                          BehaviorDSLIdle |
                          BehaviorDSLRepeat |
                          BehaviorDSLPhase |
                          BehaviorDSLParallel |
                          BehaviorDSLSelect |
                          BehaviorDSLSequence |
                          BehaviorDSLWhilst;

function isLeaf(dsl: BehaviorDSL): dsl is BehaviorDSLLeaf {
  return dsl.hasOwnProperty("leaf");
}

function isIdle(dsl: BehaviorDSL): dsl is BehaviorDSLIdle {
  return dsl.hasOwnProperty("idle");
}

function isRepeat(dsl: BehaviorDSL): dsl is BehaviorDSLRepeat {
  return dsl.hasOwnProperty("repeat");
}

function isParallel(dsl: BehaviorDSL): dsl is BehaviorDSLParallel {
  return dsl.hasOwnProperty("parallel");
}

function isPhase(dsl: BehaviorDSL): dsl is BehaviorDSLPhase {
  return dsl.hasOwnProperty("phase");
}

function isSelect(dsl: BehaviorDSL): dsl is BehaviorDSLSelect {
  return dsl.hasOwnProperty("select");
}

function isSequence(dsl: BehaviorDSL): dsl is BehaviorDSLSequence {
  return dsl.hasOwnProperty("sequence");
}

function isWhilst(dsl: BehaviorDSL): dsl is BehaviorDSLWhilst {
  return dsl.hasOwnProperty("whilst");
}

export function buildBehavior(dsl: BehaviorDSL): Behavior {
  if (isLeaf(dsl)) {
    if (typeof dsl.leaf === "function") {
      return dsl.leaf();
    } else {
      return dsl.leaf;
    }
  } else if (isRepeat(dsl)) {
    return new RepeatBehavior(buildBehavior(dsl.repeat));
  } else if (isParallel(dsl)) {
    return new ParallelBehavior(dsl.parallel.map((e) => {
      return buildBehavior(e);
    }));
  } else if (isPhase(dsl)) {
    return new PhaseBehavior(dsl.params, buildBehavior(dsl.phase));
  } else if (isSelect(dsl)) {
    return new SelectBehavior(dsl.select.map((e) => {
      return buildBehavior(e);
    }));
  } else if (isSequence(dsl)) {
    return new SequenceBehavior(dsl.sequence.map((e) => {
      return buildBehavior(e);
    }));
  } else if (isWhilst(dsl)) {
    return new WhilstBehavior(buildBehavior(dsl.whilst),
                              buildBehavior(dsl.loop));
  } else if (isIdle(dsl)) {
    return new IdleBehavior();
  } else {
    return new IdleBehavior();
  }
}
