# Minority-Game-Simulator

[![Tests](https://github.com/Taku0172/Minority-Game-Simulator/actions/workflows/test.yml/badge.svg)](https://github.com/Taku0172/Minority-Game-Simulator/actions/workflows/test.yml)

An interactive simulator for the Minority Game with adaptive agents.

## Overview

This project is an interactive web simulator of the Minority Game.

Users can freely change the memory length (m) and observe how collective behavior changes.

The simulator visualizes:

- Attendance over time
- Difference between the two choices
- Phase diagram (α vs σ²/N)

It is designed for learning game theory through simulation rather than equations alone.

## How to Use

1. Select the number of agents.
2. Select the memory length.
3. Run a simulation.
4. Observe the attendance and phase diagram.

## Theory

The Minority Game was introduced by Challet and Zhang (1997).

Agents repeatedly choose between two options.

Agents belonging to the minority side receive a payoff.

This simulator reproduces the phase transition described in the original paper.

## Built With

- JavaScript
- Chart.js
- Vitest
- GitHub Actions
- GitHub Pages

## Tests

All core functions are covered by automated tests.

Run locally:

```bash
npm install
npm run test:run

s