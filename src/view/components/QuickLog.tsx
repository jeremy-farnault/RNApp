import * as React from 'react'
import {Picker, StyleSheet, Text, TouchableOpacity, View, ScrollView, StatusBar, Dimensions} from 'react-native'
import {Col, Row, Grid} from 'react-native-easy-grid'
import ModalListLog from './ModalListLog'
import Icon from 'react-native-vector-icons/MaterialIcons'
import * as loDash from 'lodash'
import ModalSets from './ModalSets'
import exercises from '../../db/exercises'
import {ExerciseMuscle, ExerciseSet, MuscleGroups, Set} from '../../core/types'
import Header from './Header'
import Toaster from './Toaster'
import {ToasterInfo} from '../../core/enums'
import ModalRecovery from './ModalRecovery'
import {buildRecoveryTimes} from '../../utils/helper'
import ModalSearch from './ModalSearch'
import {NavigationAction, NavigationRoute, NavigationScreenProp} from 'react-navigation'

type IProps = {
  navigation: NavigationScreenProp<NavigationRoute<any>, NavigationAction>
}

type IState = {
  sets: Set[]
  currentMuscle: string
  currentExercise: string
  currentRecoveryTime: string
  showModal: boolean
  showModalSets: boolean
  showModalRecovery: boolean
  showToasterInfo: boolean
  showToasterWarning: boolean
  showModalSearch: boolean
  dataLog: ExerciseSet[]
  editing: boolean
}

class QuickLog extends React.PureComponent<IProps, IState> {
  order: string[]
  setToModify: { indexSet: number, reps: number, weight: number }
  scrollViewRef: any
  scrollViewWidth: number
  muscles: string[]
  exercises: ExerciseMuscle[]
  editedExerciseIndex: number

  constructor() {
    super()
    this.muscles = exercises.map((data: MuscleGroups) => data.muscle).sort()
    this.exercises = loDash.sortBy(exercises.find((data: MuscleGroups) => data.muscle === this.muscles[0]).exercises,
      [(exercise: ExerciseMuscle) => {
        return exercise.name
      }])
    this.state = {
      sets: [{reps: 8, weight: 75}, {reps: 8, weight: 80}, {reps: 8, weight: 85}],
      currentExercise: this.exercises[0].name,
      currentMuscle: this.muscles[0],
      currentRecoveryTime: buildRecoveryTimes()[0],
      showModal: false,
      showModalSets: false,
      showModalRecovery: false,
      showToasterInfo: false,
      showToasterWarning: false,
      showModalSearch: false,
      dataLog: [],
      editing: false
    }
    this.closeModalListLog = this.closeModalListLog.bind(this)
    this.closeModalSets = this.closeModalSets.bind(this)
    this.handleModalSearch = this.handleModalSearch.bind(this)
    this.updateRecovery = this.updateRecovery.bind(this)
    this.addExerciseSet = this.addExerciseSet.bind(this)
    this.deleteExercise = this.deleteExercise.bind(this)
    this.editExercise = this.editExercise.bind(this)
    this.saveEditedExercise = this.saveEditedExercise.bind(this)
    this.stopToaster = this.stopToaster.bind(this)
    this.backToOriginalState = this.backToOriginalState.bind(this)
    this.selectExerciseModalSearch = this.selectExerciseModalSearch.bind(this)
  }

  componentDidMount() {
    this.order = Object.keys(this.state.dataLog)
  }

  closeModalListLog() {
    this.setState({showModal: false})
  }

  closeModalSets() {
    this.setState({showModalSets: false})
  }

  handleModalSearch(close: boolean = false) {
    this.setState({showModalSearch: !close})
  }

  scrollToEndHorizontally() {
    if (this.scrollViewWidth >= Dimensions.get('window').width - 140) {
      this.scrollViewRef.scrollTo({
        x: this.scrollViewWidth - Dimensions.get('window').width * 0.534,
        y: 0,
        animated: true
      })
    }
  }

  updateDeleteSet(reps?: number, weight?: number) {
    let repsWeightCopy = this.state.sets.slice()
    if (reps) {
      repsWeightCopy.splice(this.setToModify.indexSet, 1, {reps: reps, weight: weight})
    } else {
      repsWeightCopy.splice(this.setToModify.indexSet, 1)
    }
    this.setState({sets: repsWeightCopy})
    this.setToModify = null
  }

  addExerciseSet = () => {
    const newSet = this.buildNewSet()
    let dataLogCopy = this.state.dataLog.slice()
    dataLogCopy.push(newSet)
    this.backToOriginalState(dataLogCopy, false)
  }

  saveEditedExercise = () => {
    const newSet = this.buildNewSet()
    let dataLogCopy = this.state.dataLog.slice()
    dataLogCopy[this.editedExerciseIndex] = newSet
    this.backToOriginalState(dataLogCopy, true)
  }

  updateRecovery = (recoveryTime: string) => {
    this.setState({showModalRecovery: false, currentRecoveryTime: recoveryTime})
  }

  buildNewSet = (): ExerciseSet => {
    return {
      exercise: this.exercises.find((exercise) => {
        return exercise.name === this.state.currentExercise
      }),
      muscleGroup: this.state.currentMuscle,
      sets: this.state.sets,
      recoveryTime: this.state.currentRecoveryTime
    }
  }

  backToOriginalState = (dataLogCopy: ExerciseSet[], wasEditing: boolean) => {
    this.order = Object.keys(dataLogCopy)
    this.exercises = loDash.sortBy(exercises.find((data: MuscleGroups) => data.muscle === this.muscles[0]).exercises,
      [(exercise: ExerciseMuscle) => {
        return exercise.name
      }])
    this.setState({
      sets: [{reps: 8, weight: 75}, {reps: 8, weight: 80}, {reps: 8, weight: 85}],
      currentExercise: this.exercises[0].name,
      currentMuscle: this.muscles[0],
      dataLog: dataLogCopy,
      editing: false,
      showToasterInfo: !wasEditing,
      showToasterWarning: wasEditing
    })
  }

  editExercise = (index: number) => {
    const exerciseToEdit = this.state.dataLog[index]
    this.setState({currentMuscle: exerciseToEdit.muscleGroup})
    this.exercises = loDash.sortBy(exercises.find((data: MuscleGroups) => data.muscle === exerciseToEdit.muscleGroup).exercises,
      [(exercise: ExerciseMuscle) => {
        return exercise.name
      }])
    this.editedExerciseIndex = index
    this.setState({
      showModal: false,
      sets: exerciseToEdit.sets,
      currentExercise: exerciseToEdit.exercise.name,
      editing: true
    })
  }

  deleteExercise = (newDataLog: ExerciseSet[]) => {
    this.setState({dataLog: newDataLog})
  }

  stopToaster = (status: ToasterInfo) => {
    this.setState({
      showToasterInfo: status === ToasterInfo.info ? false : this.state.showToasterInfo,
      showToasterWarning: status === ToasterInfo.warning ? false : this.state.showToasterWarning
    })
  }

  selectExerciseModalSearch = (exercise: string, muscle: string) => {
    this.exercises = loDash.sortBy(exercises.find((data: MuscleGroups) => data.muscle === muscle).exercises,
      [(e: ExerciseMuscle) => {
        return e.name
      }])
    this.setState({currentMuscle: muscle, currentExercise: exercise, showModalSearch: false})
  }

  render() {
    const {
      sets, editing, currentExercise, currentMuscle, showModal, showModalSets, dataLog, showToasterInfo,
      showToasterWarning, showModalRecovery, currentRecoveryTime, showModalSearch
    } = this.state
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content"/>
        <Header
          navigation={this.props.navigation}
          colorBorder="#445878"
          colorHeader="#F7F7F8"
          textColor="#445878"
          title="Quick Log"
          secondaryIcon="search"
          secondaryFunction={this.handleModalSearch}/>
        <Grid style={styles.grid}>
          <Row size={35} style={styles.rows}>
            <Col size={25} style={styles.textPickers}>
              <Text style={styles.textTitle}>Muscle:</Text>
            </Col>
            <Col size={75} style={styles.columns}>
              <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
                selectedValue={currentMuscle}
                onValueChange={(itemValue) => {
                  this.exercises = loDash.sortBy(exercises.find((data: MuscleGroups) => data.muscle === itemValue).exercises,
                    [(exercise: ExerciseMuscle) => {
                      return exercise.name
                    }])
                  this.setState({currentMuscle: itemValue})
                }}>
                {this.muscles.map((muscle: string) => {
                  return <Picker.Item key={muscle} label={muscle} value={muscle}/>
                })}
              </Picker>
            </Col>
          </Row>
          <Row size={35} style={styles.rows}>
            <Col size={25} style={styles.textPickers}>
              <Text style={styles.textTitle}>Exercise:</Text>
            </Col>
            <Col size={75} style={styles.columns}>
              <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
                selectedValue={currentExercise}
                onValueChange={(itemValue) => this.setState({currentExercise: itemValue})}>
                {this.exercises.map((muscle: ExerciseMuscle) => {
                  return <Picker.Item key={muscle.name} label={muscle.name} value={muscle.name}/>
                })}
              </Picker>
            </Col>
          </Row>
          <Row size={20} style={styles.rows}>
            <ScrollView
              horizontal={true}
              contentContainerStyle={styles.scroll}
              ref={ref => this.scrollViewRef = ref}
              onContentSizeChange={(width) => this.scrollViewWidth = width}>
              {sets.map((item: Set, index: number) => {
                return (
                  <TouchableOpacity
                    key={item.weight + index}
                    style={[styles.elemHorizontalList, styles.shadow]}
                    onPress={() => {
                      this.setToModify = {indexSet: index, reps: item.reps, weight: item.weight}
                      this.setState({showModalSets: true})
                    }}>
                    <Text style={styles.textSets}><Text>{item.reps}</Text><Text> x</Text></Text>
                    <Text style={styles.textSets}><Text>{item.weight}</Text><Text>kg</Text></Text>
                  </TouchableOpacity>
                )
              })}
              <TouchableOpacity
                onPress={() => {
                  this.scrollToEndHorizontally()
                  this.setState({sets: [...this.state.sets, loDash.last(sets)]}
                  )
                }}>
                <Icon name="add-circle-outline" size={30} color="#445878"/>
              </TouchableOpacity>
            </ScrollView>
          </Row>
          <Row size={10} style={styles.rows}>
            <Col style={styles.columnsButtons}>
              <TouchableOpacity
                style={[styles.buttonCurrentLog, styles.buttonBottom, styles.shadow]}
                onPress={() => this.setState({
                  showModal: true,
                  showToasterInfo: false,
                  showToasterWarning: false
                })}>
                <Text style={styles.buttonsText}>See log</Text>
              </TouchableOpacity>
            </Col>
            <Col style={styles.columnsButtons}>
              <Row>
                <Text style={styles.textRecovery}>{currentRecoveryTime}</Text>
              </Row>
              <Row>
                <TouchableOpacity
                  style={[styles.buttonBottom, styles.shadow, {marginTop: -4}]}
                  onPress={() => this.setState({
                    showModalRecovery: true
                  })}>
                  <Text style={styles.buttonsText}>Rec. time</Text>
                </TouchableOpacity>
              </Row>
            </Col>
            <Col style={styles.columnsButtons}>
              <TouchableOpacity
                onPress={() => {
                  editing ? this.saveEditedExercise() : this.addExerciseSet()
                }}
                style={[styles.buttonAdd, styles.buttonBottom, styles.shadow]}>
                <Text style={styles.buttonsText}>{editing ? 'Save' : 'Add'}</Text>
              </TouchableOpacity>
            </Col>
          </Row>
        </Grid>
        {showToasterInfo && <Toaster text="Exercise logged" status={ToasterInfo.info} stopToaster={this.stopToaster}/>}
        {showToasterWarning &&
        <Toaster text="Changes saved" status={ToasterInfo.warning} stopToaster={this.stopToaster}/>}
        {showModalSets && <ModalSets
          updateDeleteSet={(reps?, weight?) => this.updateDeleteSet(reps, weight)}
          deleteEnabled={sets.length > 1}
          reps={this.setToModify.reps}
          weight={this.setToModify.weight}
          closeModal={this.closeModalSets}
        />}
        {showModal && <ModalListLog
          dataLog={dataLog}
          deleteExercise={this.deleteExercise}
          editExercise={this.editExercise}
          order={this.order}
          closeModal={this.closeModalListLog}
        />}
        {showModalRecovery && <ModalRecovery
          updateRecovery={this.updateRecovery}
        />}
        {showModalSearch && <ModalSearch
          exercises={exercises}
          closeModal={this.handleModalSearch}
          selectExercise={this.selectExerciseModalSearch}/>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFF4'
  },
  logView: {
    flex: 2,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  scrollView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9'
  },
  grid: {
    flex: 1,
    backgroundColor: '#EFEFF4',
    marginRight: 20,
    marginLeft: 20
  },
  columns: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  columnsButtons: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  rows: {
    margin: 10
  },
  picker: {
    width: 250,
    height: 'auto'
  },
  elemHorizontalList: {
    flexDirection: 'column',
    marginRight: 38,
    marginLeft: 2
  },
  textPickers: {
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  scroll: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonCurrentLog: {
    position: 'absolute',
    left: 0
  },
  buttonAdd: {
    position: 'absolute',
    right: 0
  },
  shadow: {
    backgroundColor: '#FFF',
    borderRadius: 4,
    padding: 5,
    borderWidth: 1,
    borderColor: '#DDD',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1
  },
  pickerItem: {
    fontSize: 18
  },
  buttonBottom: {
    width: Dimensions.get('window').width / 4.5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30
  },
  buttonsText: {
    fontFamily: 'Montserrat-Regular'
  },
  textSets: {
    fontFamily: 'Montserrat-Regular'
  },
  textTitle: {
    fontFamily: 'Montserrat-Regular'
  },
  textRecovery: {
    fontFamily: 'Montserrat-Light',
    fontSize: 12
  }
})

export default QuickLog
