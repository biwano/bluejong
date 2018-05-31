const solver = require('javascript-lp-solver');
const { spawn } = require('child_process');

module.exports = {
  sep: '_',
  // Writes x.p.r.t
  x(player, round, table) {
    const s = this.sep;
    return `xPRT${s}${player}${s}${round}${s}${table}`;
  },
  // Writes y.p1.p2.r.t
  y(player1, player2, round, table) {
    const s = this.sep;
    return `yPRT${s}${player1}${s}${player2}${s}${round}${s}${table}`;
  },
  // Extracts xPRT from string
  splitXPRT(xPRT) {
    const splited = xPRT.split(this.sep);
    return {
      player: splited[1],
      round: splited[2],
      table: splited[3],
    };
  },
  // Creates round assignements from an xPRTs list
  arrangementFromXPRTs(xPRTs) {
    let rounds;
    if (xPRTs) {
      rounds = {};
      const keys = Object.keys(xPRTs);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        const value = xPRTs[key];
        if (value === true) {
          const xPRT = this.splitXPRT(key);
          rounds[xPRT.round] = rounds[xPRT.round] || { tables: {} };
          const round = rounds[xPRT.round];
          round.tables[xPRT.table] = round.tables[xPRT.table] || [];
          const table = round.tables[xPRT.table];
          table.push(xPRT.player);
        }
      }
    }
    return rounds;
  },
  // Extracts xPRTs from lp_solve stdout
  xPRTsFromLPSolve(data) {
    const lines = data.split('\n');
    const xPRTs = {};
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (line.startsWith('xPRT')) {
        const splited = line.split(' ');
        const value = splited[splited.length - 1] === '1';
        const key = splited[0];
        xPRTs[key] = value;
      }
    }
    return xPRTs;
  },
  // Optimizes the Distribution of players across tables and rounds
  async solveBEOptimize(players, rounds, maxMeetups) {
    let model = [];
    const tables = players.length / 4;

    let equation;

    // No optimum lookup
    equation = 'min: ;';
    model.push(equation);

    // One player is on exactly 1 table each round
    for (let p = 0; p < players.length; p += 1) {
      for (let r = 0; r < rounds; r += 1) {
        equation = '';
        for (let t = 0; t < tables; t += 1) {
          equation = `${equation} 1 ${this.x(p, r, t)}`;
        }
        equation = `${equation} = 1`;
        model.push(equation);
      }
    }
    // 4 players per table each round
    for (let r = 0; r < rounds; r += 1) {
      for (let t = 0; t < tables; t += 1) {
        equation = '';
        for (let p = 0; p < players.length; p += 1) {
          equation = `${equation} 1 ${this.x(p, r, t)}`;
        }
        equation = `${equation} = 4`;
        model.push(equation);
      }
    }
    // Defining  y.p1.p2.r.t = x.p1.r.t*x.p2.r.t
    for (let r = 0; r < rounds; r += 1) {
      for (let t = 0; t < tables; t += 1) {
        for (let p1 = 0; p1 < players.length - 1; p1 += 1) {
          for (let p2 = p1 + 1; p2 < players.length; p2 += 1) {
            equation = '';
            equation = `1 ${this.y(p1, p2, r, t)} -1 ${this.x(p1, r, t)} <= 0`;
            model.push(equation);
            equation = `1 ${this.y(p1, p2, r, t)} -1 ${this.x(p2, r, t)} <= 0`;
            model.push(equation);
            equation = `1 ${this.y(p1, p2, r, t)} -1 ${this.x(p1, r, t)} -1 ${this.x(p2, r, t)} >= -1`;
            model.push(equation);
          }
        }
      }
    }

    // Players meet < maxMeetups
    for (let p1 = 0; p1 < players.length - 1; p1 += 1) {
      for (let p2 = p1 + 1; p2 < players.length; p2 += 1) {
        equation = '0';
        for (let r = 0; r < rounds; r += 1) {
          for (let t = 0; t < tables; t += 1) {
            equation = `${equation} + ${this.y(p1, p2, r, t)}`;
          }
        }
        equation = `${equation} <= ${maxMeetups}`;
        model.push(equation);
      }
    }

    // Contraintes booleens
    for (let r = 0; r < rounds; r += 1) {
      for (let t = 0; t < tables; t += 1) {
        for (let p = 0; p < players.length; p += 1) {
          equation = `int ${this.x(p, r, t)}`;
          model.push(equation);
        }
      }
    }
    for (let r = 0; r < rounds; r += 1) {
      for (let t = 0; t < tables; t += 1) {
        for (let p1 = 0; p1 < players.length - 1; p1 += 1) {
          for (let p2 = p1 + 1; p2 < players.length; p2 += 1) {
            equation = `int ${this.y(p1, p2, r, t)}`;
            model.push(equation);
          }
        }
      }
    }
    // Convertion en JSON
    model = solver.ReformatLP(model);
    // convertion en String
    model = solver.ReformatLP(model);

    // Exécuting lp_solve
    const lpSolve = spawn('lp_solve');
    let xPRTs = {};

    // Receiving data
    lpSolve.stdout.on('data', (data_) => {
      const data = data_.toString();
      // Cannot solve
      if (data.indexOf('infeasible') >= 0) {
        xPRTs = undefined;
      } else {
      // Solved!
        Object.assign(xPRTs, this.xPRTsFromLPSolve(data));
      }
    });
    // Writing model to lp_solve stdin
    lpSolve.stdin.write(model);
    lpSolve.stdin.end();

    return new Promise((resolve) => {
      lpSolve.on('close', () => {
        resolve(this.arrangementFromXPRTs(xPRTs));
      });
    });
  },
  // Shuffles an array
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
    }
  },
  // Distributes players randomly across tables and rounds
  solveBERandom(players, nbRounds) {
    const rounds = {};
    for (let r = 0; r < nbRounds; r += 1) {
      const playersShuffled = players.slice(0);
      this.shuffleArray(playersShuffled);
      let tableIndex = 0;
      let table;
      rounds[r] = { tables: {} };
      const round = rounds[r];
      for (let p = 0; p < players.length; p += 1) {
        // table initialization
        if (p % 4 === 0) {
          tableIndex = p / 4;
          round.tables[tableIndex] = [];
          table = round.tables[tableIndex];
        }
        // Adding player to table
        table.push(playersShuffled[p]);
      }
    }
    return rounds;
  },
  // Distributes players across tables and rounds
  async solve(players, rounds, maxMeetups_) {
    // We try to let everyone meet one time max
    let maxMeetups = maxMeetups_ || 1;
    return new Promise(async (resolve, reject) => {
      try {
        // Lets try solving
        let result = await this.solveBEOptimize(players, rounds, maxMeetups);
        if (result) {
          result.maxMeetups = maxMeetups;
        } else {
          // It does not work we lessen the constraints
          maxMeetups += 1;
          // If it is really too hard we go random
          if (maxMeetups >= 4) {
            result = this.solveBERandom(players, rounds);
          } else {
          // If not we still try optimizing recursively
            result = await this.solve(players, rounds, maxMeetups);
          }
        }
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  },
};
