import { put, select, takeEvery } from 'redux-saga/effects';
import { left, right } from 'Selectors/Input';
import { format, split } from 'Selectors/Output';
import ActionTypes from 'Actions/Types';
import Actions from 'Actions/Creators';
import { createDiff } from 'Utils/CalculateDiff';

// 間引き時間
// const debouncing = ms => new Promise(resolve => setTimeout(resolve, ms));

export function* worker() {
  // Debouncing（間引き）処理
  // yield call(debouncing, 1000);

  // 現在のstateを取得
  const leftInput = yield select(left);
  const rightInput = yield select(right);
  const outputFormat = yield select(format);
  const outputSplit = yield select(split);
  const [rawDiff, contents] = createDiff(leftInput, rightInput, outputFormat, outputSplit);
  yield put(Actions.outputDiffResult(rawDiff, contents));
}

export function* leftWatcher() {
  /* パフォーマンスに影響が出るようならdebouncingする
  let task;
  while (true) {
    yield take(ActionTypes.INPUT_LEFT_CHANGE);
    if (task) {
      yield cancel(task);
    }
    task = yield fork(worker);
  }
  */
  yield takeEvery(ActionTypes.INPUT_LEFT_CHANGE, worker);
}
export function* rightWatcher() {
  yield takeEvery(ActionTypes.INPUT_RIGHT_CHANGE, worker);
}
export function* formatWatcher() {
  yield takeEvery(ActionTypes.OUTPUT_FORMAT_CHANGE, worker);
}
export function* splitWatcher() {
  yield takeEvery(ActionTypes.OUTPUT_SPLIT_CHANGE, worker);
}
