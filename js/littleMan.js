//Defered

/**
 * MEMORY SECTION
 */
const memCells = document.getElementById('memCells')
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    //create our new cell
    let newCell = document.createElement('div')
    let cellAddy = document.createElement('p')
    let cellValue = document.createElement('p')

    //style & set
    cellValue.id = "cell" + j + i
    newCell.classList.add(
      "bg-white",
      "border",
      "border-black",
      "justify-stretch",
      "rounded-md",
      "m-1"
    )

    cellAddy.innerHTML = "" + j + i
    cellAddy.classList.add(
      "text-sm",
      "text-white",
      "text-right",
      "bg-black",
      "px-1"
    )

    cellValue.innerHTML = "---"

    //Add to document
    newCell.appendChild(cellAddy)
    newCell.appendChild(cellValue)
    memCells.appendChild(newCell)
  }
}

/**
 * INPUT SECTION
 */
const valueIn = document.getElementById("pushValue")
const inSheet = document.getElementById("inSheet")
let inArray = new Array()

//Add a value to the 
function pushIn() {
  const inValue = Number(valueIn.value)
  if (inValue >= 0 && inValue <= 999 && inArray.length <= 20) {
    inArray.push(Number(inValue))
    updateInSheet()
  }
}

function clearIn() {
  inArray = new Array()
  updateInSheet()
}

function validateIn() {
  if (valueIn.value > 999) valueIn.value = 999
  if (valueIn.value < 0) valueIn.value = 0
}

function updateInSheet() {
  inSheet.innerHTML = ""
  inArray.map((val) => {
    const p = document.createElement("p")
    p.innerHTML = val
    inSheet.prepend(p)
  })
}

/**
 * Output section
 */
const outSheet = document.getElementById("outSheet")
let outArray = new Array()

function pushOut(value) {
  outArray.push(value)
  updateOutSheet()
}

function updateOutSheet() {
  outSheet.innerHTML = ""
  outArray.map((val) => {
    const p = document.createElement("p")
    p.innerHTML = val
    outSheet.append(p)
  })
}

function clearOut() {
  outArray = new Array()
  updateOutSheet()
}

/**
 * PROGRAM SECTION
 */
const progAddy = document.getElementById("progAddy")
const progData = document.getElementById("progData")
const progAutoInc = document.getElementById("progAutoInc")

function validateProgData(data) {
  if (isNaN(data)) {
    console.log("Not valid integer")
    return false
  }

  if (data < 0 || data > 999) {
    console.log("Value out of range")
    return false
  }

  return true
}

function validateProgAddy(addy) {
  if (isNaN(addy)) {
    console.log("Not valid integer")
    return false
  }

  if (addy < 0 || addy > 99) {
    console.log("Value out of range")
    return false
  }

  return true
}

function validateProgInputs(addy, data) {
  return validateProgAddy(addy) && validateProgData(data)
}

function pushProg() {
  let addy = Math.floor(Number(progAddy.value))
  const data = Math.floor(Number(progData.value))

  if (!validateProgInputs(addy, data)) return

  let addyHigh = Math.floor(addy / 10)
  let addyLow = addy % 10

  const dataHun = Math.floor(data / 100)
  const dataTen = Math.floor((data / 10) % 10)
  const dataOne = data % 10

  const cell = document.getElementById("cell" + addyHigh + addyLow)
  cell.innerHTML = `${dataHun}${dataTen}${dataOne}`

  if (progAutoInc.checked) {
    addy += 1
    addyHigh = Math.floor(addy / 10)
    addyLow = addy % 10

    progAddy.value = `${addyHigh}${addyLow}`
  }
}

function clearProgAddress() {
  const addy = Math.floor(Number(progAddy.value))

  if (!validateProgAddy(addy)) return

  const addyHigh = Math.floor(addy / 10)
  const addyLow = addy % 10

  const cell = document.getElementById("cell" + addyHigh + addyLow)
  cell.innerHTML = "---"
}

/**
 * Info Section
 */
const aRegister = document.getElementById("aRegister")
const programCounter = document.getElementById("programCounter")

const runState = document.getElementById("runState")
const runSpeed = document.getElementById("runSpeed")
const curSpeed = document.getElementById("curSpeed")

let progCounter = 0
let isRunning = false

function changeRunSpeed() {
  curSpeed.innerHTML = runSpeed.value + " Hz"

  if (isRunning) {
    haltProgram()
    runProgram()
  }
}

function stepProgram() {
  if (!parseInstruction()) return

  progCounter += 1
  if (progCounter > 99) progCounter = 0
  programCounter.innerHTML = `${Math.floor(progCounter / 10)}${progCounter % 10}`
}

let interval
function runProgram() {
  interval = setInterval(stepProgram, 1000 / runSpeed.value)
  runState.innerHTML = "Running"
  isRunning = true
}

function haltProgram() {
  window.clearInterval(interval)
  runState.innerHTML = "Halted"
  isRunning = false
}

function resetProgramCounter() {
  haltProgram()
  progCounter = 0

  programCounter.innerHTML = '00'
}

/**
 * System Section
 */
function parseInstruction() {
  pcHigh = Math.floor(progCounter / 10)
  pcLow = progCounter % 10

  const curCell = document.getElementById(`cell${pcHigh}${pcLow}`)
  const cellValue = Number(curCell.innerHTML)

  if (isNaN(cellValue) || cellValue == 0) {
    haltProgram()
    console.log("Coffee break!")
    return false
  }

  const inst = Math.floor(cellValue / 100)
  const instAddy = cellValue % 100

  //console.log(inst + " " + instAddy)
  //1xx Add xx to A
  if (inst == 1) return addToA(instAddy)
  //2xx Sub xx from A
  if (inst == 2) return subFromA(instAddy)
  //3xx A -> xx
  if (inst == 3) return storeA(instAddy)
  //5xx xx -> A
  if (inst == 5) return loadA(instAddy)
  //6xx jump xx
  if (inst == 6) return jump(instAddy)
  //7xx jump xx if A == 0
  if (inst == 7) return jumpZero(instAddy)
  //8xx jump xx if A > 0
  if (inst == 8) return jumpPositive(instAddy)
  //901 IN -> A
  if (inst == 9 && instAddy == 1) return readIn()
  //902 A -> OUT
  if (inst == 9 && instAddy == 2) return writeOut()

  return true
}

function addToA(addy) {
  let aValue = Number(aRegister.innerHTML)

  const instA = translateAddy(addy)
  cellValue = Number(document.getElementById(`cell${instA.high}${instA.low}`).innerHTML)

  if (isNaN(cellValue) || isNaN(aValue)) return false

  aValue += cellValue
  aRegister.innerHTML = aValue
  return true
}

function subFromA(addy) {
  let aValue = Number(aRegister.innerHTML)

  const instA = translateAddy(addy)
  cellValue = Number(document.getElementById(`cell${instA.high}${instA.low}`).innerHTML)

  if (isNaN(cellValue) || isNaN(aValue)) return false

  aValue -= cellValue
  aRegister.innerHTML = aValue
  return true
}

function storeA(addy) {
  const aValue = Number(aRegister.innerHTML)
  const instAddy = translateAddy(addy)
  const cell = document.getElementById(`cell${instAddy.high}${instAddy.low}`)

  if (isNaN(aValue) || !cell) return false
  cell.innerHTML = aValue

  return true
}

function loadA(addy) {
  const instAddy = translateAddy(addy)
  const cellValue = Number(document.getElementById(`cell${instAddy.high}${instAddy.low}`).innerHTML)

  if (isNaN(cellValue)) return false
  aRegister.innerHTML = cellValue

  return true
}

function jump(addy) {
  if (isNaN(addy) || addy < 0 || addy > 99) return false

  progCounter = addy
  programCounter.innerHTML = addy

  return false //Always returns false as we do not want to advance the PC on step
}

function jumpZero(addy) {
  if (isNaN(addy) || addy < 0 || addy > 99) return false

  if (Number(aRegister.innerHTML) == 0) {
    progCounter = addy
    programCounter.innerHTML = addy
    return false
  } else return true
}

function jumpPositive(addy) {
  if (isNaN(addy) || addy < 0 || addy > 99) return false

  if (Number(aRegister.innerHTML) >= 0) {
    progCounter = addy
    programCounter.innerHTML = addy
    return false
  } else return true
}

function readIn() {
  if (inArray.length == 0) return false

  const value = inArray.pop()
  aRegister.innerHTML = value
  updateInSheet()

  return true
}

function writeOut() {
  const aValue = Number(aRegister.innerHTML)

  if (isNaN(aValue)) return false

  pushOut(aValue)

  return true
}

function translateAddy(addy) {
  const retObj = {}
  retObj.high = Math.floor(addy / 10) % 10
  retObj.low = addy % 10

  return retObj
}