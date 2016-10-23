import "./poly";
import { Callback } from "./runtime";
import Engine from "./engine";
export default function Particle(): (cb: Callback<Engine>) => Callback<Engine>;
