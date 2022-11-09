export function drawStatusText(context, input, player) {
  context.font = "30px Helvetica";
  context.fillText("Last input: " + input.lastKey, 20, 50);
  context.fillText("ActiveState: " + player.currentState.state, 20, 80);
}
