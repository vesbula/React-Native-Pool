'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableWithoutFeedback,
    ListView
} = React;

var SQUARE_DIMENSIONS = 30;
var TIMING_CONFIG = {duration: 30};
var DIST_TO_EDGE = screenWidth * .39;
var startCount = 10;

var Test = React.createClass({
    getInitialState: function() {
        var circs = [];
        for (var i = 0; i < startCount; i++) {
            circs.push({
                id: i,
                x: 0,
                y: 0,
                vx: 2 + Math.random() * 2,
                vy: 2 + Math.random() * 2,
                dx: 0,
                dy: 0,
                cOb: new Animated.ValueXY({x: 0, y: 0}),
            });
        }

        return {
            circles: circs,
            stop: 1
        };
    },
    stopCircle: function() {
        this.state.stop = -1 * this.state.stop;
        this.setState(this.state);
    },
    componentDidMount: function() {
        this.animateCircles();
    },
    animateCircles: function() {
        this.triggerAnimation(this.animateCircles);
    },
    triggerAnimation: function(ani) {
        for (var i = 0; i < this.state.circles.length; i++) {
                var cCircle = this.state.circles[i];
                if (cCircle.x * cCircle.x + cCircle.y * cCircle.y > DIST_TO_EDGE * DIST_TO_EDGE) {
                    var prevX = cCircle.x - cCircle.vx;
                    var prevY = cCircle.y - cCircle.vy;
                    var exitX = (1.5 * prevX + .5 * cCircle.x) / 2;
                    var exitY = (1.5 * prevY + .5 * cCircle.y) / 2;
                    cCircle.x = prevX;
                    cCircle.y = prevY;

                    var exitRad = Math.sqrt(exitX * exitX + exitY * exitY);
                    exitX = exitX * DIST_TO_EDGE / exitRad;
                    exitY = exitY * DIST_TO_EDGE / exitRad;

                    var twiceProjFactor = 2 * (exitX * cCircle.vx + exitY * cCircle.vy) / (DIST_TO_EDGE * DIST_TO_EDGE);
                    cCircle.vx = cCircle.vx - twiceProjFactor * exitX;
                    cCircle.vy = cCircle.vy - twiceProjFactor * exitY;
                    break;
                }
        }
        if (this.state.stop == 1) {
            for (var k = 0; k < this.state.circles.length; k++) {
                this.state.circles[k].x += this.state.circles[k].vx;
                this.state.circles[k].y += this.state.circles[k].vy;
            }
        }
        this.setState(this.state);
        var animateC = [];
        for (var i = 0; i < this.state.circles.length; i++) {
            var currCirc = this.state.circles[i];
            animateC.push(
                Animated.timing(currCirc.cOb, {
                    ...TIMING_CONFIG,
                    toValue: {x: currCirc.x, y: currCirc.y}
            }));
        }
        Animated.parallel(
            animateC
        ).start(ani);
    },
    getStyle: function(which) {
        return [
            styles.circle,
            {transform: this.state.circles[which].cOb.getTranslateTransform()}
        ];
    },
    render: function() {
        return (
            <View style={styles.container}>
                <View style={styles.edge}>
                </View>
                {
                    this.state.circles.map(function(c, i) {
                        return (
                            <TouchableWithoutFeedback key={i} onPress={this.stopCircle}>
                                <Animated.View style={this.getStyle(i)} />
                            </TouchableWithoutFeedback>
                        );
                    }, this)
                }
            </View>
        );
    },
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    circle : {
        width: screenWidth * .1,
        height: screenWidth * .1,
        backgroundColor: 'blue',
        borderRadius: screenWidth * .1 / 2,
        position: 'absolute',
        left: screenWidth * .45,
        top: screenWidth * .81
    },
});

AppRegistry.registerComponent('Test', () => Test);
