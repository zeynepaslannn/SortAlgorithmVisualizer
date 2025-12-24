package gui;

import javax.swing.*;
import java.awt.*;
import java.util.Arrays;

public class VisualizerPanel extends JPanel {

    private int[] array;
    private Color[] colors;
    private int maxVal = 1;

    private Color defaultColor = Color.GRAY;
    private final Color highlightColor = new Color(0, 255, 128); // neon yeşil ⚡

    public VisualizerPanel() {
        setBackground(new Color(40, 40, 40));
    }

    public void setArray(int[] arr) {
        array = Arrays.copyOf(arr, arr.length);
        maxVal = Arrays.stream(arr).max().orElse(1);
        colors = new Color[arr.length];
        Arrays.fill(colors, defaultColor);
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        if (array == null) return;

        int w = getWidth();
        int h = getHeight();
        int bw = Math.max(8, w / array.length);

        for (int i = 0; i < array.length; i++) {
            int barHeight = (int)((array[i] / (double)maxVal) * (h - 10));
            int x = i * bw;
            int y = h - barHeight;

            g.setColor(colors[i]);
            g.fillRect(x, y, bw-1, barHeight);
        }
    }

    public int[] copyArray() {
        return Arrays.copyOf(array, array.length);
    }

    public void highlight(int index, Color ignored) {
        if (colors != null && index >= 0 && index < colors.length) {
            colors[index] = highlightColor;
        }
        repaint();
    }

    public void setDefaultColor(Color c) {
        this.defaultColor = c;
        if (colors != null) {
            for (int i = 0; i < colors.length; i++) {
                colors[i] = defaultColor;
            }
        }
        repaint();
    }
}
