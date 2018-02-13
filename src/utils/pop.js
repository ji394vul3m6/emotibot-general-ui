import ErrorForm from '@/components/pop/ErrorAlert';

function popErrorWindow(context, msg, err) {
  context.$root.$emit('showWindow', {
    component: ErrorForm,
    data: {
      msg,
      info: err,
    },
    buttons: ['ok'],
  });
}

export default {
  popErrorWindow,
};
