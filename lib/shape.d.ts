import "./poly";
import { Map as _Map, List } from "immutable";
import { Entity } from "./engine";
export declare type vec2 = [number, number];
export interface Shape {
    translate(x: number, y: number): Shape;
    rotate(r: number): Shape;
    project(axis: vec2): vec2;
    dimensions(): Dimensions;
    bounds(): Bounds;
    path(): Path2D;
}
export declare function maskFor(entity: Entity): Shape;
export declare class Circle extends _Map<string, any> implements Shape {
    radius: number;
    x: number;
    y: number;
    constructor(radius: number);
    translate(x: number, y: number): Shape;
    rotate(_r: number): Shape;
    normals(other: Shape): List<vec2>;
    project(axis: vec2): vec2;
    dimensions(): Dimensions;
    bounds(): Bounds;
    path(): Path2D;
}
export declare class Polygon extends _Map<string, any> implements Shape {
    verticies: List<vec2>;
    constructor(verticies: vec2[] | List<vec2>);
    translate(x: number, y: number): Shape;
    rotate(r: number): Shape;
    normals(): List<vec2>;
    project(axis: vec2): vec2;
    dimensions(): Dimensions;
    bounds(): Bounds;
    path(): Path2D;
}
export interface Dimensions {
    width: number;
    height: number;
}
export interface Bounds {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
