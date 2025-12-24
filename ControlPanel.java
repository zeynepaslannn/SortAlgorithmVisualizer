package gui;

import javax.swing.*;
import java.awt.*;

public class ControlPanel extends JPanel {

    public JButton randomBtn = new JButton("Random");
    public JButton startBtn = new JButton("Start");
    public JButton stopBtn = new JButton("Stop");
    public JComboBox<String> sortSelect =
            new JComboBox<>(new String[]{"Insertion", "Selection", "Merge", "Quick"});
    public JSlider speedSlider = new JSlider(1,200,50);
    public JLabel timeLabel = new JLabel("Time: 0 ms");

    public JLabel comparisonLabel = new JLabel("Comparisons: 0");
    public JLabel swapLabel = new JLabel("Swaps: 0");
    public JLabel complexityLabel = new JLabel("Complexity: -");

    public ControlPanel() {
        setLayout(new FlowLayout(FlowLayout.LEFT));
        setBackground(new Color(50,50,50));

        stopBtn.setEnabled(false);
        speedSlider.setToolTipText("Lower is faster");

        add(new JLabel("Algorithm:"));
        add(sortSelect);
        add(randomBtn);
        add(startBtn);
        add(stopBtn);
        add(new JLabel("Speed:"));
        add(speedSlider);
        add(timeLabel);
        add(comparisonLabel);
        add(swapLabel);
        add(complexityLabel);
    }
}

