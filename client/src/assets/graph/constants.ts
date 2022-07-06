import { DotsOptions, PathOptions } from "./types"

export const defaultPathOptions: Required<PathOptions> = {
    strokeWidth: 2,
    stroke: '#fa3'
}

export const defaultHoverPathOptions: Required<PathOptions> = {
    strokeWidth: 3,
    stroke: '#3af'
}

export const defaultDotsOptions: Required<DotsOptions> = {
    radius: 4,
    opacity: 0,
    fill: "#fa3"
}

export const defaultHoverDotsOptions: Required<DotsOptions> = {
    radius: 4,
    opacity: 1,
    fill: "#3af"
}