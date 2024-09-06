import type { Response } from '../types';


export function okResponse({
  status: _hardcoded,
  ...rest
}: Partial<Response> = {}): Response {
  return {
    ...rest,
    status: 200,
  }
}

export function badRequestResponse({
  status: _hardcoded,
  ...rest
}: Partial<Response> = {}): Response {
  return {
    ...rest,
    status: 400,
  }
}

export function movedPermanentlyResponse({
  location,
}: {
  location: string
}): Response {
  return {
    headers: {
      location
    },
    status: 301,
  }
}

export function notFoundResponse({
  status: _hardcoded,
  ...rest
}: Partial<Response> = {}): Response {
  return {
    ...rest,
    status: 404,
  }
}


export function internalServerErrorResponse({
  status: _hardcoded,
  ...rest
}: Partial<Response> = {}): Response {
  return {
    ...rest,
    status: 500,
  }
}