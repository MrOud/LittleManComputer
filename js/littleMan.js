//Defered


/**
 * START-UP
 */

/**
 * MEMORY SECTION
 */
const memCells = document.getElementById('memCells') //Get the div to hold all the elements

//Fill in the 100 data cells
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {

    let newCell = document.createElement('div') //create our new cell
    let cellAddy = document.createElement('p') //paragraph to display address of cell
    let cellValue = document.createElement('p') //paragraph to display data stored, or --- for unused

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

    cellAddy.id = "address" + j + i
    cellAddy.innerHTML = "" + j + i
    cellAddy.classList.add(
      "text-sm",
      "text-white",
      "text-right",
      "bg-black",
      "px-1"
    )

    cellValue.innerHTML = "---"
    cellValue.classList.add(
      "md:text-lg",
      "lg:text-xl",
      "mt-1",
      "font-bold")

    //Add to document
    newCell.appendChild(cellAddy)
    newCell.appendChild(cellValue)
    memCells.appendChild(newCell)
  }
}
setCellBackground(0, "bg-green-700")

//Load any saved programs
function loadLocalStorage() {
  const localKeys = Object.keys(localStorage)
  localKeys.map((name) => {
    const lsProg = localStorage.getItem(name)
    addToProgramLoader(name, lsProg)
  })
}
loadLocalStorage()

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

function clearInSheet() {
  for (let i = 0; i < 100; i++) {
    const cellAddy = translateAddy(i)
    const cell = document.getElementById(`cell${cellAddy.high}${cellAddy.low}`)
    cell.innerHTML = "---"
  }
}

function setCellBackground(addy, bgColor) {
  const cellAddy = translateAddy(addy)
  const cellParagraph = document.getElementById("address" + cellAddy.high + cellAddy.low, bgColor)
  cellParagraph.classList.remove(...cellParagraph.classList)
  cellParagraph.classList.add(
    "text-sm",
    "text-white",
    "text-right",
    bgColor,
    "px-1",
    "rounded-md",
    "rounded-b-none"
  )
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

  setCellValue(addy, data)
}

function clearProgAddress() {
  const addy = Math.floor(Number(progAddy.value))

  if (!validateProgAddy(addy)) return

  const addyHigh = Math.floor(addy / 10)
  const addyLow = addy % 10

  const cell = document.getElementById("cell" + addyHigh + addyLow)
  cell.innerHTML = "---"
}

function setCellValue(addy, data) {
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
  curSpeed.innerHTML = parseFloat(runSpeed.value).toFixed(1) + "Hz"

  if (isRunning) {
    haltProgram()
    runProgram()
  }
}

let stepInterval

function stepProgram() {
  if (!parseInstruction()) {
    return
  }
  setCellBackground(progCounter, "bg-black")

  progCounter += 1
  if (progCounter > 99) progCounter = 0

  programCounter.innerHTML = `${Math.floor(progCounter / 10)}${progCounter % 10}`
  setCellBackground(progCounter, "bg-green-700")

  if (runState.innerHTML == "Halted") {
    runState.classList.remove("bg-red-400")
    runState.classList.add("bg-blue-400")
    runState.innerHTML = "Step"
  }
}

function runProgram() {
  if (!isRunning) {
    const stepButton = document.getElementById("stepProgram")
    stepButton.disabled = true
    stepCount = 0
    interval = setInterval(stepProgram, 1000 / runSpeed.value)
    runState.innerHTML = "Running"
    isRunning = true
    runState.classList.remove("bg-red-400", "bg-blue-400")
    runState.classList.add("bg-green-400")
  }
}

function haltProgram() {
  if (isRunning) {
    const stepButton = document.getElementById("stepProgram")
    stepButton.disabled = false
    window.clearInterval(interval)
    runState.innerHTML = "Halted"
    isRunning = false
    runState.classList.remove("bg-green-400", "bg-blue-400")
    runState.classList.add("bg-red-400")
  }
}

function resetProgramCounter() {
  haltProgram()

  setCellBackground(progCounter, "bg-black")
  progCounter = 0
  setCellBackground(progCounter, "bg-green-700")

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

  setCellBackground(progCounter, "bg-black")
  progCounter = addy
  setCellBackground(progCounter, "bg-green-700")
  programCounter.innerHTML = addy

  return false //Always returns false as we do not want to advance the PC on step
}

function jumpZero(addy) {
  if (isNaN(addy) || addy < 0 || addy > 99) return false

  if (Number(aRegister.innerHTML) == 0) {
    setCellBackground(progCounter, "bg-black")
    progCounter = addy
    setCellBackground(progCounter, "bg-green-700")
    programCounter.innerHTML = addy
    return false
  } else return true
}

function jumpPositive(addy) {
  if (isNaN(addy) || addy < 0 || addy > 99) return false

  if (Number(aRegister.innerHTML) >= 0) {
    setCellBackground(progCounter, "bg-black")
    progCounter = addy
    setCellBackground(progCounter, "bg-green-700")
    programCounter.innerHTML = addy
    return false
  } else return true
}

function readIn() {
  if (inArray.length == 0) {
    haltProgram()
    return false
  }

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

function saveState() {
  retStr = "PROG#"
  let validCells = new Array()
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const readCell = document.getElementById("cell" + i + j)
      const readCellValue = Number(readCell.innerHTML)
      if (!isNaN(readCellValue)) {
        validCells.push("" + i + j + "-" + readCellValue)
      }
    }
  }
  retStr += validCells.join("|")

  retStr += "#IN#"
  let validIn = new Array()
  inArray.map((val) => {
    validIn.push(val)
  })
  retStr += validIn.join("|")
  return retStr
}

function clickSave() {
  const saved = saveState()
  const saveName = document.getElementById("saveName")
  const progName = (saveName.value.length == 0) ? "NO-NAME" : saveName.value

  addToProgramLoader(progName, saved)
  localStorage.setItem(progName, saved)

}

function addToProgramLoader(progName, saved) {
  const savedPrograms = document.getElementById("savedPrograms")
  const newOption = document.createElement("option")

  newOption.value = saved
  newOption.innerHTML = progName
  savedPrograms.appendChild(newOption)
}

function clickSaveToClipboard() {
  const saved = saveState()
  navigator.clipboard.writeText(saved)
  pushOut("Copied to Clipboard!")
}

function loadState(loadProg) {
  if (loadProg.value == "") return

  let sectionArr = loadProg.split("#")
  resetProgramCounter()
  for (let i = 0; i < sectionArr.length; i += 2) {
    if (sectionArr[i] == "PROG") {
      clearInSheet()
      let instSets = sectionArr[i + 1].split("|")
      instSets.map((val) => {
        instParts = val.split("-")
        setCellValue(Number(instParts[0]), Number(instParts[1]))
      })
    }
    if (sectionArr[i] == "IN") {
      clearIn()
      let inValues = sectionArr[i + 1].split("|")
      inValues.map((val) => {
        inArray.push(val)
      })
      updateInSheet()
    }
  }
}

function loadSelect() {
  const loadProg = document.getElementById("progLoader")
  loadState(loadProg.value)
}

const loadModal = document.getElementById("stringLoadModal")

function loadString() {
  const loadProg = document.getElementById("stringLoadIn")
  loadState(loadProg.value)
  loadModal.classList.toggle("hidden")
  loadProg.value = ""
}

function clickLoadString() {
  loadModal.classList.toggle("hidden")
}