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
  if (inValue >= 0 && inValue <= 1024 && inArray.length <= 20) {
    inArray.push(Number(inValue))
    updateInSheet()
  }
}

function clearIn() {
  inArray = new Array()
  updateInSheet()
}

function validateIn() {
  if (valueIn.value > 1024) valueIn.value = 1024
  if (valueIn.value < 0) valueIn.value = 0
}

function updateInSheet() {
  inSheet.innerHTML = ""
  inArray.map((val) => {
    console.log(val)
    const p = document.createElement("p")
    p.innerHTML = val
    inSheet.prepend(p)
  })
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

console.log(aRegister.innerHTML + " " + programCounter.innerHTML)
console.log(runState.innerHTML + " " + runSpeed.value + " " + curSpeed.innerHTML)

function changeRunSpeed() {
  curSpeed.innerHTML = runSpeed.value + " Hz"

  if (isRunning) {
    haltProgram()
    runProgram()
  }
}

function stepProgram() {
  progCounter += 1
  if (progCounter > 99) progCounter = 0

  if (!parseInstruction()) return

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

  return true
}
