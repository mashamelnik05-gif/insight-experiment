// Инициализация jsPsych
const jsPsych = initJsPsych({
  display_element: 'jspsych-target',
  on_finish: function() {
    // Сохранить данные в CSV и скачать
    const csv = jsPsych.data.get().csv();
    const participant = jsPsych.data.get().values()[0]?.participant || 'NOID';
    const group = jsPsych.data.get().values()[0]?.group || 'NOGROUP';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `data_${participant}_g${group}_${timestamp}.csv`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
});

// Массив с таймлайном
let timeline = [];

// 1. Ввод ID участника
const participant_id_trial = {
  type: jsPsychSurveyText,
  questions: [
    {prompt: 'Введите ID участника:', name: 'participant_id', required: true}
  ],
  button_label: 'Продолжить',
  on_finish: function(data){
    const id = data.response.participant_id.trim();
    jsPsych.data.addProperties({ participant: id });
  }
};
timeline.push(participant_id_trial);

// 2. Рандомизация по группе (1, 2, 3)
const assign_group_trial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: '<p>Назначение группы...</p><p>Нажмите кнопку, чтобы продолжить.</p>',
  choices: ['Продолжить'],
  on_start: function(trial){
    // случайная группа 1, 2 или 3
    const group = Math.floor(Math.random() * 3) + 1;
    jsPsych.data.addProperties({ group: group });
    // ЭТО видит участник: временно покажем группу, чтобы ты могла проверить.
    trial.stimulus = `<p>Вам назначена группа: ${group} (позже это спрячем).</p><p>Нажмите кнопку, чтобы продолжить.</p>`;
  }
};
timeline.push(assign_group_trial);

// 3. Простой демонстрационный trial
const demo_trial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p>Тестовый экран. Нажмите пробел.</p>',
  choices: [' ']
};
timeline.push(demo_trial);

// Старт эксперимента
jsPsych.run(timeline);
